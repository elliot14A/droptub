import { DEFAULT_PICTURE_URL } from "@/lib/constants";
import Image from "next/image";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="w-full h-screen overflow-clip flex flex-wrap">
        <div className="relative w-1/2 flex-initial">
          <Image fill src={DEFAULT_PICTURE_URL} alt="Image-1" />
        </div>
        <div className="w-1/2 flex-shrink-0 p-4">{children}</div>
      </div>
    </div>
  );
}
