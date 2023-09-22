import Stripe from "stripe";
import getRawBody from "raw-body";
import { NextRequest } from "next/server";
import { Readable } from "stream";
import axios from "axios";

async function convertReadableStreamToReadable(
  readableStream: ReadableStream,
): Promise<Readable> {
  const reader = readableStream.getReader();

  return new Readable({
    async read(_: number) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null); // Signal the end of the stream
        } else {
          this.push(value);
        }
      } catch (error) {
        this.emit("error", error);
      }
    },
  });
}
export const POST = async (req: NextRequest) => {
  const signature = req.headers.get("stripe-signature");
  const signinSecret = process.env.STRIPE_SIGNING_KEY;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
  });
  let event;
  const readable = await convertReadableStreamToReadable(req.body!);
  try {
    const rawBody = await getRawBody(readable);
    event = stripe.webhooks.constructEvent(rawBody, signature!, signinSecret!);
  } catch (err) {
    console.log(err);
    return new Response("internal server errorr", { status: 500 });
  }
  const data = event.data.object as { customer: string; id: string };
  const customer = (await stripe.customers.retrieve(data.customer)) as {
    email: string;
  };
  switch (event.type) {
    case "customer.subscription.created":
      subscriptionRequest({
        email: customer.email,
        subscriptionId: data.id,
        type: "upgrade",
      });
      break;
    case "customer.subscription.updated":
      subscriptionRequest({
        email: customer.email,
        subscriptionId: "",
        type: "upgrade",
      });
      break;
    case "customer.subscription.deleted":
      subscriptionRequest({
        email: customer.email,
        subscriptionId: "",
        type: "cancel",
      });
      break;
  }
  return new Response(JSON.stringify({ success: true }));
};

async function subscriptionRequest({
  email,
  subscriptionId,
  type,
}: {
  email: string;
  subscriptionId: string;
  type: "upgrade" | "cancel";
}) {
  if (type === "upgrade" && subscriptionId === "") return;
  const master_key = process.env.MASTER_KEY;
  const serverUrl = process.env.PUBLIC_NEXT_BLOG_POSTS_SERVER_URL;
  let url =
    serverUrl +
    "/api/" +
    (type === "cancel" ? "cancelSubscription" : "upgradeSubscription");
  try {
    await axios.post(
      url,
      { email, subscriptionId },
      {
        headers: {
          Authorization: `Bearer ${master_key}`,
        },
      },
    );
    url = serverUrl + "/api/request";
    await axios.post(url, { paymentSuccessful: true });
  } catch (err) {
    await axios.post(url, { paymentSuccessful: false });
  }
}
