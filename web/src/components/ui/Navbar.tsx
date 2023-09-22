import { User } from "@/lib/zustand/user";
import { FC } from "react";
import { Logo } from "./logo";
import Button from "./Button";
import Link from "next/link";
import { DEFAULT_PICTURE_URL } from "@/lib/constants";
import Image from "next/image";
import { checkout } from "../stripe/checkout";

export const Navbar: FC<User> = ({ tier }) => {
  return (
    <nav className="bg-white border-gray-200">
      <div className="max-w-screen flex flex-wrap items-center justify-between">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-2">
          <Link href="/home">
            <Logo />
          </Link>
        </div>
        <ul className="font-medium flex space-x-8 mt-0 border-0 bg-white p-4">
          {tier === "freemium" ? (
            <li>
              <Button
                onClick={() =>
                  checkout({
                    price: "price_1NisA5SCkWeaWPDl1ZxRu9qv",
                    successUrl: `${window.location.origin}/subscription/success/profile`,
                  })
                }
                className="p-4"
                size="small"
              >
                Upgrade
              </Button>
            </li>
          ) : null}
          <li>
            <Link href="/home/profile">
              <div className="relative pt-1">
                <div className="relative w-8 h-8">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    src={DEFAULT_PICTURE_URL}
                    alt="profile picture"
                    className="rounded-full"
                  />
                </div>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
