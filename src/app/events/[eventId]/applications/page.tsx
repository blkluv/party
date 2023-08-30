import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ManageEventRoleRequests } from "~/app/_components/event-management-helpers";
import { getPageTitle } from "~/utils/getPageTitle";
import { getUserEventRole } from "~/utils/getUserEventRole";

type PageProps = { params: { eventId: string } };

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getPageTitle("Applications"),
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
    <div className="max-w-xl w-full my-8 px-4 mx-auto">
      <h1 className="font-bold text-2xl text-center mb-8">Applications</h1>
      <ManageEventRoleRequests eventId={props.params.eventId} />
    </div>
  );
};

export default Page;
