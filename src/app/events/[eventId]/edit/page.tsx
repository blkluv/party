import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPageTitle } from "~/utils/getPageTitle";
import { getUserEventRole } from "~/utils/getUserEventRole";
import { ManagementContainer } from "../manage/event-management-helpers";

export const metadata: Metadata = {
  title: getPageTitle("Manage Event"),
};

export const dynamic = "force-dynamic";

type PageProps = { params: { eventId: string } };
const Page = async (props: PageProps) => {
  const userAuth = auth();

  if (!userAuth.userId) {
    redirect("/sign-in");
  }

  const eventRole = await getUserEventRole(props.params.eventId);

  if (eventRole !== "admin") {
    return redirect(`/events/${props.params.eventId}`);
  }

  return (
    <div className="mx-2 sm:mx-auto sm:w-full max-w-xl my-8">
      <ManagementContainer eventId={props.params.eventId} />
    </div>
  );
};

export default Page;
