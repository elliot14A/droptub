import { loginCredentialsSchema } from "@/lib/validators";
import axios, { AxiosError } from "axios";
import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { cookies } from "next/headers";
export const POST = async (req: NextRequest, _: Response) => {
  const body = await req.json();
  try {
    const { email, password } = loginCredentialsSchema.parse(body);
    const serverUrl = process.env.PUBLIC_NEXT_BLOG_POSTS_SERVER_URL;
    const res = await axios.post(serverUrl + "/api/login", {
      email,
      password,
    });
    const {
      accessToken,
      refreshToken,
    }: { refreshToken: string; accessToken: string } = res.data;
    cookies().set("accessToken", accessToken);
    cookies().set("refreshToken", refreshToken);
    return new Response(JSON.stringify("login successful"), {
      status: 200,
      headers: {},
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return new Response(JSON.stringify(err), {
        status: 400,
      });
    }
    // check if error is AxiosError
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        return new Response(
          JSON.stringify({ message: err.response.data.message }),
          { status: 401 },
        );
      } else if (err.response?.status === 400) {
        return new Response(JSON.stringify(err.response.data), {
          status: 400,
        });
      }
      return new Response(JSON.stringify(err), { status: 500 });
    }
    return new Response(JSON.stringify(err), { status: 500 });
  }
};
