import axios, { AxiosError } from "axios";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest, _: Response) => {
  try {
    const serverUrl = process.env.PUBLIC_NEXT_BLOG_POSTS_SERVER_URL;
    const refreshCookie = req.cookies.get("refreshToken");
    const accessToken = req.cookies.get("accessToken");
    await axios.post(
      serverUrl + "/api/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshCookie?.value}`,
          "x-refresh": `Bearer ${accessToken?.value}`,
        },
      },
    );
    return new Response("OK");
  } catch (err) {
    console.log(err);
    if (err instanceof AxiosError) {
      if (err.response?.status === 403) {
        return new Response(
          JSON.stringify({ message: err.response.data.message }),
          { status: 403 },
        );
      }
      return new Response(JSON.stringify(err), { status: 500 });
    }
    return new Response(JSON.stringify(err), { status: 500 });
  } finally {
    cookies().delete("accessToken");
    cookies().delete("refreshToken");
  }
};
