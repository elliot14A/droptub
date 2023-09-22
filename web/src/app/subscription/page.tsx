"use client";
import { checkout } from "@/components/stripe/checkout";
import Button from "@/components/ui/Button";
import { Logo } from "@/components/ui/logo";
import { Dot } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  return (
    <div>
      <nav className="bg-white border-gray-200">
        <div className="max-w-screen flex flex-wrap items-center justify-between">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-2">
            <Link href="/home">
              <Logo />
            </Link>
          </div>
        </div>
      </nav>
      <div className="mt-10 container flex flex-col items-center justify-center">
        <p className="text-center font-semibold text-3xl">Choose Your Plan</p>
        <p className="mt-5 w-max text-center text-md">
          Subscribe to standard plan to enjoy unlimited uploads and with
          absolutely no waiting time
        </p>
        <p className="w-max text-center text-md">in between uploads!</p>
        <div className="mt-10 flex container w-full h-full justify-center gap-3">
          <div className="flex flex-col items-center justify-center w-[20rem] h-[30rem] border border-zinc-200 rounded-lg shadow-md">
            <span className="text-center font-semibold text-2xl">Free</span>
            <span className="my-5 font-bold text-3xl">$0</span>
            <span className="mt-10 text-sm flex items-center justify-center">
              <Dot className="h-4 w-4" />
              <p>One upload per hour</p>
            </span>
            <span className="mt-2 text-sm flex items-center justify-center">
              <Dot className="h-4 w-4" />
              <p>upload 1 image at once</p>
            </span>
            <Button
              onClick={() => {
                toast.success("Your account is created successfully");
                router.replace("/login");
              }}
              className="border border-zinc-200 mt-10 bg-white hover:bg-white text-black"
            >
              Continue
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center w-[20rem] h-[30rem] border border-zinc-200 rounded-lg shadow-md">
            <span className="text-center font-semibold text-2xl">Standard</span>
            <span className="my-5 font-bold text-3xl">$5/month</span>
            <span className="mt-10 text-sm flex items-center justify-center">
              <Dot className="h-4 w-4" />
              <p>Unlimted uploads</p>
            </span>
            <span className="mt-2 text-sm flex items-center justify-center">
              <Dot className="h-4 w-4" />
              <p>No waiting time</p>
            </span>
            <span className="mt-2 text-sm flex items-center justify-center">
              <Dot className="h-4 w-4" />
              <p>Cancel anytime</p>
            </span>
            <Button
              onClick={async () => {
                checkout({
                  price: "price_1NisA5SCkWeaWPDl1ZxRu9qv",
                  successUrl: `${window.location.origin}/subscription/success`,
                });
              }}
              className="mt-2"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
