import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ManageEventDetails } from "~/app/_components/event-management-helpers";
import { getPageTitle } from "~/utils/getPageTitle";
import { getUserEventRole } from "~/utils/getUserEventRole";

type PageProps = { params: { eventId: string } };

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getPageTitle("Edit Details"),
};

const Page = async (props: PageProps) => {
  const userAuth = auth();

  if (!userAuth.userId) {
    redirect("/sign-in");
  }

  const userEventRole = await getUserEventRole(props.params.eventId);

  if (userEventRole !== "admin") {
    redirect(`/events/${props.params.eventId}`);
  }

  return (
    <div className="max-w-xl w-full my-8 px-2 mx-auto">
      <ManageEventDetails eventId={props.params.eventId} />
    </div>
  );
};

export default Page;
