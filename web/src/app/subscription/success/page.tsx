"use client";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-600 mb-8">
        You can now login to enjoy your subscription.
      </p>
      <Button
        onClick={async () => {
          router.replace("/login");
        }}
        className="bg-blue-500 text-lg text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Login
      </Button>
    </div>
  );
};

export default Page;
