"use client";
import Button from "@/components/ui/Button";
import { User, useUserStore } from "@/lib/zustand/user";
import axios from "axios";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  return (
    <div className="mt-4 flex flex-col items-center justify-center">
      <h1 className="mb-4 text-3xl">Are you sure?</h1>
      <p>You will lose all the benefits</p>
      <Button
        onClick={async () => {
          const res = await axios.post("/api/subscription/cancel");
          console.log(res.data);
          const updatedUser: User = {
            subscriptionId: null,
            id: user!.id,
            email: user!.email,
            tier: "freemium",
            name: user!.name,
          };
          setUser(updatedUser);
          router.replace("/home");
        }}
        className="mt-4 bg-red-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Cancel
      </Button>
    </div>
  );
};

export default Page;
