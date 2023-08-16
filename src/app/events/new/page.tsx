import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreateEventForm } from "~/app/_components/event-form-variants";
import type { EventType } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";

export const metadata: Metadata = {
  title: getPageTitle("New Event"),
};

const Page = (props: { searchParams: { discussion?: string } }) => {
  const userAuth = auth();
  if (!userAuth.userId) {
    redirect("/sign-in");
  }

  const _eventType: EventType =
    props.searchParams.discussion !== undefined ? "discussion" : "event";

  return (
    <div className="mx-2 sm:mx-auto sm:w-full max-w-lg my-8">
      <h1 className="font-bold text-3xl mb-8 text-center">New Event</h1>
      <CreateEventForm />
    </div>
  );
};

export default Page;
