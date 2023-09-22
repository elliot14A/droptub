import Stripe from "stripe";
import { NextRequest } from "next/server";
import axios from "axios";
import { User } from "@/lib/zustand/user";

export const POST = async (req: NextRequest) => {
  const accessToken = req.cookies.get("accessToken");
  const refreshToken = req.cookies.get("refreshToken");
  if (!accessToken || !refreshToken)
    return new Response("Forbidden", { status: 403 });
  try {
    const serverUrl = process.env.PUBLIC_NEXT_BLOG_POSTS_SERVER_URL;
    const res = await axios.get(serverUrl + "/api/user_info", {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        "x-refresh": `Bearer ${refreshToken.value}`,
      },
    });
    const { subscriptionId }: User = res.data;
    if (!subscriptionId) return new Response("Bad request", { status: 400 });
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-08-16",
    });
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    console.log(subscription);
    return new Response(JSON.stringify(subscription));
  } catch (err) {
    console.log(err);
  }
};
