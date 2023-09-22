import { createImageSchema } from "@/lib/validators";
import axios, { AxiosError } from "axios";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  const serverUrl = process.env.PUBLIC_NEXT_BLOG_POSTS_SERVER_URL;
  const accessToken = req.cookies.get("accessToken");
  const refreshToken = req.cookies.get("refreshToken");
  if (!accessToken || !refreshToken) return new Response(null, { status: 403 });
  try {
    const res = await axios.get(serverUrl + "/api/images", {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        "x-refresh": `Bearer ${refreshToken.value}`,
      },
    });
    return new Response(JSON.stringify(res.data));
  } catch (err) {
    return new Response("errror while fetching", { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken");
  const refreshToken = req.cookies.get("refreshToken");
  if (!accessToken || !refreshToken) return new Response(null, { status: 403 });
  const body = await req.json();
  try {
    const image = createImageSchema.parse(body);
    const serverUrl = process.env.PUBLIC_NEXT_BLOG_POSTS_SERVER_URL;
    const res = await axios.post(serverUrl + "/api/images", image, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        "x-refresh": `Bearer ${refreshToken.value}`,
      },
    });
    return new Response(JSON.stringify(res.data), { status: 201 });
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
}
