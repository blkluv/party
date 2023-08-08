/* eslint-disable @next/next/no-img-element */
"use client";

import { useUser } from "@clerk/nextjs";
import { createId } from "@paralleldrive/cuid2";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PartySocket from "partysocket";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import ReactMarkdown from "react-markdown";
import { match } from "ts-pattern";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { env } from "~/config/env";
import type { ChatErrorEvent } from "~/utils/chat";
import {
  socketEventSchema,
  type ChatMessageEvent,
  type ChatSocketEvent,
} from "~/utils/chat";
import { isEventOver } from "~/utils/event-time-helpers";
import { getImageUrl } from "~/utils/getImageUrl";
import { cn } from "~/utils/shadcn-ui";

const urlRegex = new RegExp(/^http(s)?:\/\/.{2,}$/);
const imageExtensions = ["jpg", "png", "jpeg", "webp", "gif", "avif"];

export const ChatRoom: FC<{
  eventId: string;
  eventName: string;
  startTime: Date;
}> = (props) => {
  const [socket, setSocket] = useState<null | PartySocket>(null);
  const [events, setEvents] = useState<ChatSocketEvent[]>([]);
  const user = useUser();
  const userInput = useRef<HTMLInputElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const { push } = useRouter();

  const sendMessage = async (message: string) => {
    if (!socket || !user.isSignedIn || message.length === 0) {
      return;
    }

    const newMessageEvent: ChatMessageEvent = {
      __type: "CHAT_MESSAGE",
      data: {
        message: message
          .split(" ")
          .map((word): string => {
            const isImage = imageExtensions.some((e) =>
              word.split("?")[0].endsWith(e)
            );
            const isUrl = urlRegex.test(word);

            if (isUrl) {
              if (isImage) {
                const imageUrl = getImageUrl({ url: word, width: 500 });
                return `![${imageUrl}](${imageUrl})`;
              }

              return `[${word}](${word})`;
            }

            return word;
          })
          .join(" "),
        userId: user.user.id,
        userName: user.user.fullName ?? "User",
        userImageUrl: user.user.imageUrl,
        eventId: props.eventId,
        createdAt: new Date(),
        id: createId(),
      },
    };

    scrollToBottom({ smooth: true });

    socket.send(JSON.stringify(newMessageEvent));
  };

  const scrollToBottom = useCallback((args?: { smooth?: boolean }) => {
    if (bottom.current) {
      bottom.current.scrollIntoView({
        inline: "end",
        block: "end",
        behavior: args?.smooth ? "smooth" : "instant",
      });
    }
  }, []);

  useEffect(() => {
    const newSocket = new PartySocket({
      host: env.NEXT_PUBLIC_CHAT_HOST,
      room: props.eventId,
      query: {
        authorization: "123",
      },
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
          scrollToBottom();
        })
        .with({ __type: "CHAT_MESSAGE" }, (val) => {
          flushSync(() => {
            setEvents((prev) => [...prev, val]);
          });
          scrollToBottom({ smooth: true });
        })
        .with({ __type: "ERROR" }, (val) => {
          flushSync(() => {
            setEvents((prev) => [...prev, val]);
          });
          scrollToBottom({ smooth: true });
        });
    });

    return () => {
      newSocket.close();
    };
  }, [props.eventId, scrollToBottom]);

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
    <div className="flex-1 flex flex-col mx-auto w-full max-w-4xl p-4">
      <div className="flex-1 relative flex flex-col gap-1 text-sm mb-8">
        <div className="flex-1 relative">
          <div className="absolute inset-0 flex flex-col gap-1 overflow-y-auto px-2 py-4">
            {events.map((event, i) => (
              <div className="flex items-center" key={`event ${i}`}>
                {event.__type === "CHAT_MESSAGE" && (
                  <MessageEventView event={event} />
                )}
                {event.__type === "ERROR" && <ErrorEventView event={event} />}
              </div>
            ))}
            <div ref={bottom} id="bottom" className="h-2 shrink-0"></div>
          </div>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (userInput.current) {
              await sendMessage(userInput.current.value);
              userInput.current.value = "";
            }
          }}
          className="flex gap-2 fixed sm:bottom-0 bottom-16 py-2 left-0 right-0 px-4 bg-neutral-900/90 backdrop-blur z-50 sm:mx-auto sm:max-w-4xl"
        >
          <Input ref={userInput} />

          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
};

const MessageEventView: FC<{
  event: ChatMessageEvent;
}> = (props) => {
  const user = useUser();

  return (
    <div
      className={cn(
        "rounded-2xl p-3 flex items-start gap-2",
        user.user?.id === props.event.data.userId
          ? "bg-blue-500 ml-auto"
          : "bg-neutral-800"
      )}
    >
      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
        <Image
          src={props.event.data.userImageUrl}
          width={50}
          height={50}
          alt=""
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-semibold">{props.event.data.userName}</p>
        <div className="text-white prose-invert prose-sm">
          <ReactMarkdown
            components={{
              a: ({ className, ...p }) => (
                <a
                  {...p}
                  className={cn(className, "underline")}
                  target="_blank"
                />
              ),
              img: ({ className, src }) => (
                <Image
                  className={className}
                  src={src ?? ""}
                  alt=""
                  width={500}
                  height={500}
                />
              ),
            }}
          >
            {props.event.data.message}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const ErrorEventView: FC<{ event: ChatErrorEvent }> = (props) => {
  return (
    <div className="p-3 text-xs text-white bg-red-600 rounded-2xl ml-auto">
      {props.event.data.message}
    </div>
  );
};
