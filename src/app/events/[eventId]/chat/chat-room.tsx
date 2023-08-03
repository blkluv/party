"use client";

import { useUser } from "@clerk/nextjs";
// Import PartySocket - a lightweight abstraction over WebSocket
import PartySocket from "partysocket";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { match } from "ts-pattern";
import { Button } from "~/app/_components/ui/button";
import { env } from "~/config/env";
import {
  socketEventSchema,
  type ChatMessageEvent,
  type ChatSocketEvent,
} from "~/utils/chat";

export const ChatRoom: FC<{ eventId: string }> = (props) => {
  const [socket, setSocket] = useState<null | PartySocket>(null);
  const [events, setEvents] = useState<ChatSocketEvent[]>([]);
  const user = useUser();

  const sendMessage = (message: string) => {
    if (!socket || !user.isSignedIn) {
      return;
    }

    const newMessageEvent: ChatMessageEvent = {
      __type: "CHAT_MESSAGE",
      data: {
        message,
        userId: user.user.id,
      },
    };

    socket.send(JSON.stringify(newMessageEvent));

    setEvents((prev) => [...prev, newMessageEvent]);
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
        console.log(validatedMessage.error);
        return;
      }

      match(validatedMessage.data)
        .with({ __type: "INITIAL_MESSAGES" }, (val) => {
          setEvents(val.data.messages);
        })
        .with({ __type: "CHAT_MESSAGE" }, (val) => {
          setEvents((prev) => [...prev, val]);
        })
        .with({ __type: "USER_JOINED" }, (val) => {
          setEvents((prev) => [...prev, val]);
        });
    });

    return () => {
      newSocket.close();
    };
  }, [props.eventId]);

  return (
    <div>
      <Button
        onClick={() => {
          sendMessage("hello");
        }}
      >
        Send Message
      </Button>
      <div>
        {events.map((event, i) => (
          <ChatEventView key={`event ${i}`} event={event} />
        ))}
      </div>
    </div>
  );
};

const ChatEventView: FC<{ event: ChatSocketEvent }> = (props) => {
  return match(props.event)
    .with(
      {
        __type: "CHAT_MESSAGE",
      },
      (val) => <div>{val.data.message}</div>
    )
    .with(
      {
        __type: "USER_JOINED",
      },
      (val) => <div>{val.data.name} Joined</div>
    )
    .otherwise(() => null);
};
