import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getUserEventRole } from "~/utils/getUserEventRole";
import { ManagementContainer } from "../manage/event-management-helpers";

type PageProps = { params: { eventId: string } };
const Page = async (props: PageProps) => {
  const userAuth = auth();

  if (!userAuth.userId) {
    redirect("/sign-in");
  }

  const eventRole = await getUserEventRole(props.params.eventId);

  if (eventRole === null) {
    return redirect(`/events/${props.params.eventId}`);
  }

  return (
    <div className="mx-2 sm:mx-auto sm:w-full max-w-xl my-8">
      <ManagementContainer eventId={props.params.eventId} role={eventRole} />
    </div>
  );
};

export default Page;
