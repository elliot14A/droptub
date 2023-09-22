import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const accessToken = req.cookies.get("accessToken");
  const refreshToken = req.cookies.get("refreshToken");
  const { isAuth, xRefreshToken } = await isAuthenticated({
    accessToken: accessToken?.value || "",
    refreshToken: refreshToken?.value || "",
  });
  if (xRefreshToken) {
    req.cookies.set("accessToken", xRefreshToken);
  }
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const sensitiveRoutes = ["/home"];
  const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
    return NextResponse.next();
  }

  if (isAccessingSensitiveRoute && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/home/:path*"],
};
async function isAuthenticated({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  if (accessToken === "" || refreshToken === "") return { isAuth: false };
  try {
    const serverUrl = process.env.PUBLIC_NEXT_BLOG_POSTS_SERVER_URL;
    const res = await fetch(serverUrl + "/api/user_info", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh": `Bearer ${refreshToken}`,
      },
    });
    // check if x-refresh-token is in header exists
    const xRefreshToken = res.headers.get("x-refresh-token");
    return { isAuth: true, xRefreshToken };
  } catch (err) {
    return { isAuth: false };
  }
}
