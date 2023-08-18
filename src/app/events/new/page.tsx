import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreateEventForm } from "~/app/_components/event-form-variants";
import type { EventType } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";

type PageProps = { searchParams: { discussion?: string } };

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  return {
    title: getPageTitle(
      `New ${
        props.searchParams.discussion !== undefined ? "Conversation" : "Event"
      }`
    ),
  };
};

const Page = (props: PageProps) => {
  const userAuth = auth();
  if (!userAuth.userId) {
    redirect("/sign-in");
  }

  const eventType: EventType =
    props.searchParams.discussion !== undefined ? "discussion" : "event";

  return (
    <div className="mx-2 sm:mx-auto sm:w-full max-w-lg my-8">
      <h1 className="font-bold text-3xl mb-8 text-center">
        {`New ${
          props.searchParams.discussion !== undefined
            ? "Event Discussion"
            : "Event"
        }`}
      </h1>
      <CreateEventForm type={eventType} />
    </div>
  );
};

export default Page;
