import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { env } from "./config/env";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/(.*)"],
  beforeAuth: () => {
    const response = NextResponse.next();

    response.headers.set(
      "Access-Control-Allow-Origin",
      env.NEXT_PUBLIC_WEBSITE_URL
    );
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE,OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
