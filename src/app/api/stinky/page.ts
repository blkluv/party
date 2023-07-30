import { NextResponse } from "next/server";

export const GET = () => {
  return NextResponse.json({ something: "gabungus" }, { status: 200 });
};
