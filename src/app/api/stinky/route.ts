import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const GET = () => {
  const userAuth = auth();
  return NextResponse.json({ auth: userAuth }, { status: 200 });
};
