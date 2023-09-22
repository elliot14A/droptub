"use client";
import Button from "@/components/ui/Button";
import { User, useUserStore } from "@/lib/zustand/user";
import axios from "axios";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { setUser } = useUserStore();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-600 mb-8">
        You can now continue to enjoy your subscription.
      </p>
      <Button
        onClick={async () => {
          try {
            const res = await axios.get("/api/user");
            const data: User = res.data;
            setUser(data);
          } catch (e) {
            console.log(e);
          } finally {
            router.replace("/home");
          }
        }}
        className="bg-blue-500 text-lg text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Continue
      </Button>
    </div>
  );
};

export default Page;
