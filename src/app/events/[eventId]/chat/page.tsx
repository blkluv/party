import { redirect } from "next/navigation";
import { env } from "~/config/env";
import { ChatRoom } from "./chat-room";

type PageProps = { params: { eventId: string } };

const Page = (props: PageProps) => {
  if (!env.NEXT_PUBLIC_FEATURE_CHAT_MESSAGES){
    redirect(`/events/${props.params.eventId}`)
  }
  return <ChatRoom eventId={props.params.eventId} />;
};

export default Page;
