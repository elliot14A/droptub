"use client";
import { FC, useEffect, useState } from "react";
import Button from "./Button";
import UploadModal from "./UploadModal";
import { PlusCircle, Timer } from "lucide-react";
import { useUserStore } from "@/lib/zustand/user";
import axios from "axios";
import { useImageStore } from "@/lib/zustand/images";

export const FloatingActionButton: FC = () => {
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [upload, setUpload] = useState<{
    canUpload: boolean;
    diffInMins: number;
  }>({ canUpload: true, diffInMins: 0 });
  const { user } = useUserStore();
  const { images } = useImageStore();
  useEffect(() => {
    const fetchUploadInfo = async () => {
      if (user?.tier !== "premium") {
        try {
          const response = await axios.get("/api/images/canUpload");
          const { canUpload, diffInMins } = response.data;
          setUpload({ canUpload, diffInMins });
          setMinutes(diffInMins);
        } catch (error) {
          console.error("Error fetching upload info:", error);
        }
      } else {
        setUpload({ canUpload: true, diffInMins: 0 });
      }
    };
    fetchUploadInfo();
  }, [user, images]);
  const [minutes, setMinutes] = useState(upload.diffInMins);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          clearInterval(interval);
          setUpload({ canUpload: true, diffInMins: 0 });
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [minutes, seconds]);
  return (
    <div className="group">
      {showUploadModal ? (
        <UploadModal handleState={() => setShowUploadModal(!showUploadModal)} />
      ) : null}
      <Button
        disabled={upload.canUpload === false}
        onClick={() => setShowUploadModal(!showUploadModal)}
        className="fixed z-90 bottom-10 right-8 flex justify-center items-center disabled:bg-white disabled:border disabled:border-red-700 disabled:border-dotted"
      >
        {upload.canUpload ? (
          <div className="flex gap-x-2">
            <PlusCircle className="mt-[0.125rem] w-6 h-6" />
            <span className="m-1 text-sm">New Upload</span>
          </div>
        ) : (
          <div className="flex gap-x-2 text-red-700">
            <Timer className="w-6 h-6" />
            <span className="mt-[0.25rem] text-center text-sm">
              {minutes > 9 ? minutes : "0" + minutes} :
              {seconds > 9 ? seconds : "0" + seconds}
            </span>
          </div>
        )}
      </Button>
    </div>
  );
};
