import axios from "axios";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const GET = async (req: NextRequest) => {
  const accessToken = req.cookies.get("accessToken");
  const refreshToken = req.cookies.get("refreshToken");
  if (!accessToken || !refreshToken)
    return new Response(JSON.stringify({ message: "unauthorized" }), {
      status: 401,
    });
  const serverUrl = process.env.PUBLIC_NEXT_BLOG_POSTS_SERVER_URL;
  try {
    const res = await axios.get(serverUrl + "/api/user_info", {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        "x-refresh": `Bearer ${refreshToken.value}`,
      },
    });
    const newAccessToken = res.headers["x-access-token"];
    if (newAccessToken) {
      cookies().set("accessToken", newAccessToken);
    }
    return new Response(JSON.stringify(res.data));
  } catch (err) {
    console.log(err);
    return new Response(null, { status: 500 });
  }
};
