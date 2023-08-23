import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPageTitle } from "~/utils/getPageTitle";
import { getUserEventRole } from "~/utils/getUserEventRole";
import { ManagementContainer } from "./event-management-helpers";

type PageProps = { params: { eventId: string } };

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getPageTitle("Manage Event"),
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
    <div className="max-w-2xl w-full my-8 px-2 mx-auto">
      <ManagementContainer eventId={props.params.eventId} />
    </div>
  );
};

export default Page;
