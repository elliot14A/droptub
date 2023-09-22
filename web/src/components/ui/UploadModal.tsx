import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useUserStore } from "@/lib/zustand/user";
import Image from "next/image";
import Button from "./Button";
import { uploadImage } from "@/lib/utils";
import { toast } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { CreateImageSchema } from "@/lib/validators";
import { useImageStore } from "@/lib/zustand/images";

interface UploadModalProps {
  handleState: () => void;
}

export default function UploadModal({ handleState }: UploadModalProps) {
  const [open, setOpen] = useState(true);
  const { user } = useUserStore();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { images: imageStore, setImages: setImageStore } = useImageStore();

  const handleFileInputChange = (event: any) => {
    const files = event.target.files;
    handleFiles(files);
  };

  const handleFiles = (files: any) => {
    const imageFiles = Array.from(files).filter((file: any) =>
      file.type.startsWith("image/"),
    );
    if (user?.tier === "premium") {
      setImages((prevImages) => [...prevImages, ...imageFiles]);
    } else {
      setImages((_) => [imageFiles[imageFiles.length - 1]]);
    }
  };
  const handleUpload = async () => {
    setLoading(true);
    try {
      const urls: CreateImageSchema = (await uploadImage(images)) || [];
      if (urls.length === 0) {
        toast.error("Something went wrong");
        return;
      }
      const res = await axios.post("/api/images/", urls);
      const data = JSON.parse(JSON.stringify(res.data));
      setImageStore([...data, ...imageStore]);
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.error("You have to wait till next upload");
          window.location.reload();
        }
      }
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white  shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="w-full flex items-center">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Upload an Image
                      </Dialog.Title>
                      <div className="mt-8">
                        <input
                          type="file"
                          id="fileInput"
                          accept="image/jpeg, image/png, image/gif"
                          onChange={handleFileInputChange}
                          className="hidden"
                          multiple={user?.tier === "premium"}
                        />
                        <label
                          htmlFor="fileInput"
                          className="px-4 py-2 bg-black text-white rounded cursor-pointer"
                        >
                          {user?.tier === "premium"
                            ? "Select Images"
                            : "Select Image"}
                        </label>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-8">
                        {images.map((image, index) => showImage(image, index))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 gap-x-4 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      setOpen(false);
                      handleState();
                    }}
                  >
                    Cancel
                  </button>
                  <Button
                    isLoading={loading}
                    onClick={handleUpload}
                    disabled={images.length === 0}
                    size="small"
                  >
                    Upload
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function showImage(image: any, index: number) {
  return (
    <div key={index} className="bg-white border border-black w-full">
      <div className="relative p-1">
        <div className="relative w-[8rem] h-40">
          <Image
            fill
            referrerPolicy="no-referrer"
            src={URL.createObjectURL(image)}
            alt="profile picture"
          />
        </div>
      </div>
    </div>
  );
}
