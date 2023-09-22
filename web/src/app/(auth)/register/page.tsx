"use client";

import Button from "@/components/ui/Button";
import { Logo } from "@/components/ui/logo";
import {
  RegisterCredentials,
  registerCredentialsSchema,
} from "@/lib/validators";
import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";

interface PageProps {}

const Page: FC<PageProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerCredentialsSchema),
  });
  const router = useRouter();
  const registerUser: SubmitHandler<RegisterCredentials> = async (data) => {
    setIsLoading(true);
    try {
      const { email, password, name } = registerCredentialsSchema.parse(data);
      await axios.post("/api/register", { email, password, name });
      toast.success("registered successfully");
      router.replace("/subscription");
    } catch (err) {
      setIsLoading(false);
      if (err instanceof ZodError) {
        toast.error(err.message);
        return;
      }
      if (err instanceof AxiosError) {
        if (err.response?.status === 400 || err.response?.status === 409) {
          toast.error(err.response.data.message);
          return;
        }
      }
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="m-12">
        <Logo />
      </div>
      <div className="w-full">
        <form
          className="container w-full max-w-sm mx-auto mt-8"
          onSubmit={handleSubmit(registerUser)}
        >
          <div className="mb-8 font-bold text-3xl ">Hey There!</div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Fullname
            </label>
            <input
              type="text"
              id="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-black focus:border-black"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">
                {errors.name.message}
              </p>
            )}
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-black focus:border-black"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-black focus:border-black"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Button isLoading={isLoading} className="w-full">
              Register
            </Button>
          </div>
          <p className="text-sm text-gray-500 text-center m-10">
            Registered?
            <a href="/login" className="pl-1 text-blue-600">
              Login to your account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Page;
