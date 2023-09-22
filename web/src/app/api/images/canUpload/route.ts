import axios, { AxiosError } from "axios";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken");
  const refreshToken = req.cookies.get("refreshToken");
  if (!accessToken || !refreshToken) return new Response(null, { status: 403 });
  const serverUrl = process.env.PUBLIC_NEXT_BLOG_POSTS_SERVER_URL;
  try {
    const res = await axios.get(serverUrl + "/api/canUpload", {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        "x-refresh": `Bearer ${refreshToken.value}`,
      },
    });
    return new Response(JSON.stringify(res.data));
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        return new Response(
          JSON.stringify({ message: err.response.data.message }),
          { status: 401 },
        );
      } else if (err.response?.status === 403) {
        return new Response(JSON.stringify(err.response.data), {
          status: 403,
        });
      }
      return new Response(JSON.stringify(err), { status: 500 });
    }
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
