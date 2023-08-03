"use client";

import { useUser } from "@clerk/nextjs";
import { createId } from "@paralleldrive/cuid2";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PartySocket from "partysocket";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { match } from "ts-pattern";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { env } from "~/config/env";
import {
  socketEventSchema,
  type ChatMessageEvent,
  type ChatSocketEvent,
} from "~/utils/chat";
import { isEventOver } from "~/utils/isEventOver";
import { cn } from "~/utils/shadcn-ui";

export const ChatRoom: FC<{
  eventId: string;
  eventName: string;
  startTime: Date;
}> = (props) => {
  const [socket, setSocket] = useState<null | PartySocket>(null);
  const [events, setEvents] = useState<ChatSocketEvent[]>([]);
  const user = useUser();
  const [userInput, setUserInput] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const [_messageError, setMessageError] = useState("");
  const { push } = useRouter();

  const sendMessage = async (message: string) => {
    if (!socket || !user.isSignedIn || message.length === 0) {
      return;
    }

    const isMessageSafe = true;

    if (!isMessageSafe) {
      setMessageError("Message is inappropriate");
      return;
    }

    const newMessageEvent: ChatMessageEvent = {
      __type: "CHAT_MESSAGE",
      data: {
        message,
        userId: user.user.id,
        userName: user.user.fullName ?? "User",
        userImageUrl: user.user.imageUrl,
        eventId: props.eventId,
        createdAt: new Date(),
        id: createId(),
      },
    };

    socket.send(JSON.stringify(newMessageEvent));
    setMessageError("");

    flushSync(() => {
      setEvents((prev) => [...prev, newMessageEvent]);
    });

    bottom.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const newSocket = new PartySocket({
      host: env.NEXT_PUBLIC_CHAT_HOST,
      room: props.eventId,
    });

    setSocket(newSocket);

    newSocket.addEventListener("message", (message) => {
      const validatedMessage = socketEventSchema.safeParse(
        JSON.parse(message.data)
      );

      if (!validatedMessage.success) {
        return;
      }

      match(validatedMessage.data)
        .with({ __type: "INITIAL_MESSAGES" }, (val) => {
          flushSync(() => {
            setEvents(val.data.messages);
          });
          bottom.current?.scrollIntoView({ behavior: "smooth" });
        })
        .with({ __type: "CHAT_MESSAGE" }, (val) => {
          flushSync(() => {
            setEvents((prev) => [...prev, val]);
          });
          bottom.current?.scrollIntoView({ behavior: "smooth" });
        })
        .with({ __type: "USER_JOINED" }, (val) => {
          flushSync(() => {
            setEvents((prev) => [...prev, val]);
          });
          bottom.current?.scrollIntoView({ behavior: "smooth" });
        });
    });

    return () => {
      newSocket.close();
    };
  }, [props.eventId]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Event is over if current time is past max event duration
      if (isEventOver(props.startTime)) {
        push("/");
      }
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [props.startTime, push]);

  return (
    <div className="flex-1 relative flex flex-col mx-auto w-full max-w-4xl gap-1 text-sm p-4">
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex flex-col gap-1 overflow-y-auto p-2">
          {events.map((event, i) => (
            <div className="flex items-center" key={`event ${i}`}>
              <ChatEventView event={event} />
            </div>
          ))}
          <div className="" ref={bottom} />
        </div>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage(userInput);
          setUserInput("");
        }}
        className="flex gap-2 mt-auto"
      >
        <Input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

const ChatEventView: FC<{ event: ChatSocketEvent }> = (props) => {
  const user = useUser();
  return match(props.event)
    .with(
      {
        __type: "CHAT_MESSAGE",
      },
      (val) => (
        <div
          className={cn(
            "rounded-2xl p-3 flex items-start gap-2",
            user.user?.id === val.data.userId
              ? "bg-blue-500 ml-auto"
              : "bg-neutral-800"
          )}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image src={val.data.userImageUrl} width={50} height={50} alt="" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold">{val.data.userName}</p>
            <p>{val.data.message}</p>
          </div>
        </div>
      )
    )
    .with(
      {
        __type: "USER_JOINED",
      },
      (val) => (
        <div className="p-3 text-xs text-neutral-400">
          {val.data.name} Joined
        </div>
      )
    )
    .otherwise(() => null);
};
