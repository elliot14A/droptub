"use client";
import { checkout } from "@/components/stripe/checkout";
import Button from "@/components/ui/Button";
import { LogoutButton } from "@/components/ui/Logout";
import { DEFAULT_PICTURE_URL } from "@/lib/constants";
import { useUserStore } from "@/lib/zustand/user";
import { Dot } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const logoutCallback = () => {
    router.replace("/login");
  };
  const freeSubscriptionCallback = () =>
    checkout({
      price: "price_1NisA5SCkWeaWPDl1ZxRu9qv",
      successUrl: `${window.location.origin}/subscription/success/profile`,
    });
  const standardSubscriptionCallBack = () =>
    router.push("/home/profile/cancel");
  return (
    <div className="container flex items-center justify-center">
      <div className="w-[30rem] m-4 container flex flex-col">
        <div className="w-max">
          <p className="text-2xl font-bold m-4 text-left">Profile</p>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="relative rounded-full h-[10rem] w-[10rem] overflow-clip">
            <Image src={DEFAULT_PICTURE_URL} alt="profile picture" fill />
          </div>
          <div className="flex justify-center items-center flex-col space-y-3">
            <Button className="w-[14rem] bg-white border border-zinc-400 text-black hover:bg-white">
              Change picture
            </Button>
            <Button className="w-full">Delete picture</Button>
          </div>
        </div>
        <form className="container w-full mt-8 mx-0">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Fullname
            </label>
            <input
              type="text"
              id="text"
              placeholder={user?.name}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-black focus:border-black"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              placeholder={user?.email}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-black focus:border-black"
              readOnly
            />
          </div>
        </form>
        <div className="w-full">
          <span className="font-semibold text-xl">Subscription</span>
        </div>
        {user?.tier === "freemium" ? (
          <FreeSubscription callback={freeSubscriptionCallback} />
        ) : (
          <StandardSubscription callback={standardSubscriptionCallBack} />
        )}
        <div className="mt-4">
          <LogoutButton
            callback={() => {
              setUser(null);
              logoutCallback();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;

const StandardSubscription = ({ callback }: { callback: any }) => {
  return (
    <div className="flex justify-evenly border bg-gray-100 border-blue-600 w-full rounded-lg py-8 px-4 mt-4">
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-xs">Standard</div>
        <div className="font-semibold text-xs">$5/month</div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="text-xs flex items-center">
          <Dot className="text-blue-600" />
          <div>Unlimited uploads</div>
        </div>
        <div className="text-xs flex items-center ">
          <Dot className="text-blue-600" />
          <div>No waiting time</div>
        </div>
      </div>
      <div className="mt-1">
        <Button
          onClick={() => callback()}
          className="bg-red-400 hover:bg-red-400"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

const FreeSubscription = ({ callback }: { callback: any }) => {
  return (
    <div className="flex justify-evenly border bg-gray-100 border-blue-600 w-full rounded-lg py-8 px-4 mt-4">
      <div className="flex flex-col gap-4 items-center justify-center">
        <div className="font-semibold text-xs">Freemium</div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="text-xs flex items-center">
          <Dot className="text-blue-600" />
          <div>One upload at once</div>
        </div>
        <div className="text-xs flex items-center ">
          <Dot className="text-blue-600" />
          <div>1hr waiting time</div>
        </div>
      </div>
      <div className="mt-1">
        <Button onClick={() => callback()} className="bg-black hover:bg-black">
          Upgrade
        </Button>
      </div>
    </div>
  );
};
