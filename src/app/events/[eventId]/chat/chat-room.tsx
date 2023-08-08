/* eslint-disable @next/next/no-img-element */
"use client";

import { useUser } from "@clerk/nextjs";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
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
import { trpc } from "~/utils/trpc";

const urlRegex = new RegExp(/^http(s)?:\/\/.{2,}$/);
const imageExtensions = ["jpg", "png", "jpeg", "webp", "gif", "avif"];

export const ChatRoom: FC<{
  eventId: string;
  eventName: string;
  startTime: Date;
  isUserPlatformAdmin: boolean;
  authToken: string;
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
          .map((word): string | undefined => {
            const isUrl = urlRegex.test(word);

            if (isUrl) {
              const isImage = imageExtensions.some((e) =>
                word.split("?")[0].endsWith(e)
              );

              if (isImage) {
                const imageUrl = getImageUrl({ url: word, width: 500 });
                return `![${imageUrl}](${imageUrl})`;
              }

              return `[${word}](${word})`;
            }

            return word;
          })
          .filter(Boolean)
          .join(" "),
        userId: user.user.id,
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
        authorization: props.authToken,
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
          if (val.data.code === "UNAUTHORIZED") {
            push("/");
          }

          flushSync(() => {
            setEvents((prev) => [...prev, val]);
          });
          scrollToBottom({ smooth: true });
        });
    });

    return () => {
      newSocket.close();
    };
  }, [props.eventId, scrollToBottom, props.authToken, push]);

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
  const { data: senderData } = trpc.auth.getUser.useQuery({
    userId: props.event.data.userId,
  });

  return (
    <div
      className={cn(
        "rounded-2xl p-3 flex items-start gap-4",
        user.user?.id === props.event.data.userId
          ? "bg-blue-500 ml-auto"
          : "bg-neutral-800"
      )}
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          {senderData?.imageUrl && (
            <Image
              src={senderData.imageUrl}
              width={50}
              height={50}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {senderData?.role === "admin" && (
          <div className="absolute -bottom-1 -right-1">
            <CheckBadgeIcon className="w-5 h-5 text-green-500 relative rounded-full z-10" />
            <div className="bg-white w-3 h-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute rounded-full z-0" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-px">
        <p className="font-semibold">{senderData?.name}</p>
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
