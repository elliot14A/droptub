import { loadStripe } from "@stripe/stripe-js";
export async function checkout({
  price,
  successUrl,
}: {
  price: string;
  successUrl: string;
}) {
  const getStripe = () => {
    const stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    );
    return stripePromise;
  };
  try {
    const stripe = await getStripe();
    await stripe?.redirectToCheckout({
      mode: "subscription",
      lineItems: [{ price, quantity: 1 }],
      successUrl: successUrl,
      cancelUrl: `${window.location.origin}/login`,
    });
  } catch (err) {
    console.log(err);
  }
}
