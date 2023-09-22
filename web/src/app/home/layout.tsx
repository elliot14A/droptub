"use client";
import { Navbar } from "@/components/ui/Navbar";
import { User, useUserStore } from "@/lib/zustand/user";
import { FC, useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [userState, setUserState] = useState<User | null>();
  const { user } = useUserStore();
  useEffect(() => {
    setUserState(user);
  }, [user]);
  if (!userState) {
    return <div className="flex item-center justify-center">Loading...</div>;
  }
  return (
    <div className="w-screen flex flex-col">
      <div className="fixed w-full z-10">
        <Navbar
          id={userState.id}
          email={userState.email}
          tier={userState.tier}
          name={userState.name}
          subscriptionId={userState.subscriptionId}
        />
      </div>
      <div className="mt-20">{children}</div>
    </div>
  );
};

export default Layout;
