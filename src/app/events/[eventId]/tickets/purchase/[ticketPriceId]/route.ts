import { NextResponse } from "next/server";
import { env } from "~/config/env";

export const dynamic = "force-dynamic";

// TODO - remove after first event

type RouteProps = {
  params: { eventId: string };
};

export const GET = async (req: Request, props: RouteProps) => {
  const { searchParams } = new URL(req.url);

  try {
    const code = searchParams.get("code");

    const newUrl = new URL(
      `${env.NEXT_PUBLIC_WEBSITE_URL}/events/${props.params.eventId}`
    );
    if (code) {
      newUrl.searchParams.set("promotionCode", code);
    }

    return NextResponse.redirect(newUrl.toString());
  } catch (error) {
    // Redirect to event page in case of error
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_WEBSITE_URL}/events/${props.params.eventId}`
    );
  }
};
