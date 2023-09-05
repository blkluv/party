import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPageTitle } from "~/utils/getPageTitle";
import { getUserEventRole } from "~/utils/getUserEventRole";
import { TicketsTable } from "./ticket-admin-options";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: getPageTitle("Tickets"),
};
type PageProps = { params: { eventId: string } };

const Page = async (props: PageProps) => {
  const eventRole = await getUserEventRole(props.params.eventId);

  if (eventRole !== "manager" && eventRole !== "admin") {
    redirect(`/events/${props.params.eventId}`);
  }

  return (
    <div className="flex flex-col gap-8 sm:py-8 py-4 w-full max-w-xl mx-auto">
      <TicketsTable eventId={props.params.eventId} />
    </div>
  );
};

export default Page;
