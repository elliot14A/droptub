"use client";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { Image as Img, useImageStore } from "@/lib/zustand/images";
import axios from "axios";
import { Download } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Page = () => {
  const { images, setImages } = useImageStore();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getImages = async () => {
      try {
        setLoading(true);
        const res = await axios.get("api/images");
        const data = JSON.parse(JSON.stringify(res.data));
        setImages(data.data);
      } catch (err) {
        toast.error("error while loading images");
      } finally {
        setLoading(false);
      }
    };
    getImages();
  }, []);
  return (
    <div className="overflow-scroll">
      {loading ? (
        <Loading />
      ) : images.length === 0 ? (
        "No images uploaded"
      ) : (
        <ImageGrid images={images} />
      )}
      <FloatingActionButton />
    </div>
  );
};

export default Page;

function ImageGrid({ images }: { images: Img[] }) {
  const groupImagesByDate = (images: Img[]) => {
    const groupedImages: Record<string, Img[]> = {};
    images.map((image) => {
      const createdAtDate = new Date(image.createdAt);
      const dateKey = createdAtDate.toDateString();

      if (!groupedImages[dateKey]) {
        groupedImages[dateKey] = [];
      }

      groupedImages[dateKey].push(image);
    });

    return groupedImages;
  };

  const renderImageGroups = () => {
    const groupedImages = groupImagesByDate(images);

    return Object.entries(groupedImages).map(([date, images]) => (
      <div key={date} className="m-4">
        <div className="flex text-xl  mb-2 ">
          <span>
            {date === new Date(Date.now()).toDateString()
              ? "Today"
              : date === new Date(Date.now() - 86400000).toDateString()
                ? "Yesterday"
                : date}
          </span>
          <div className="ml-10 mt-[0.125rem] text-sm text-center rounded-lg h-6 w-10 bg-gray-100">
            <span>{images.length}</span>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-y-4">
          {images.map((image, index) => (
            <div key={index}>
              <div
                key={index}
                className="relative w-[12rem] h-[10rem] flex flex-col items-center rounded-md overflow-hidden"
              >
                <Image fill src={image.url} alt={`Image ${index}`} />
                <div className="absolute w-6 h-6 bottom-1 right-2 flex justify-center items-center bg-gray-100 bg-opacity-50 rounded-lg">
                  <a href={image.url} className="px-4 py-2 text-white">
                    <Download className="text-black h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div>
      {images.length > 0 ? (
        renderImageGroups()
      ) : (
        <p className="text-center">No images available.</p>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      Loading your images.....
    </div>
  );
}
