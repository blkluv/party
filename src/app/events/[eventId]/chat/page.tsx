import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { env } from "~/config/env";
import { ChatRoom } from "./chat-room";

type PageProps = { params: { eventId: string } };

const Page = async (props: PageProps) => {
  const userAuth = auth();

  if (!env.NEXT_PUBLIC_FEATURE_CHAT_MESSAGES || !userAuth.userId) {
    redirect(`/events/${props.params.eventId}`);
  }

  return <ChatRoom eventId={props.params.eventId} />;
};

export default Page;
