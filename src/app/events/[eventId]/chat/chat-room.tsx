/* eslint-disable @next/next/no-img-element */
"use client";

import { useUser } from "@clerk/nextjs";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { createId } from "@paralleldrive/cuid2";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PartySocket from "partysocket";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import ReactMarkdown from "react-markdown";
import { match } from "ts-pattern";
import { ClientDate } from "~/app/_components/ClientDate";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { env } from "~/config/env";
import type { EVENT_ROLES } from "~/db/schema";
import type { ChatErrorEvent, UserTypingEvent } from "~/utils/chat";
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
  eventLocation: string | null;
  startTime: Date;
  role: (typeof EVENT_ROLES)[number] | null;
  authToken: string;
}> = (props) => {
  const [socket, setSocket] = useState<null | PartySocket>(null);
  const [events, setEvents] = useState<ChatSocketEvent[]>([]);
  const [typingUsers, setTypingUsers] = useState<UserTypingEvent[]>([]);
  const user = useUser();
  const userInput = useRef<HTMLInputElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const { push } = useRouter();

  const sendMessage = async (message: string) => {
    if (
      !socket ||
      !user.isSignedIn ||
      message.length === 0 ||
      message.split("").every((char) => char === " ")
    ) {
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

    const isUserTyping = typingUsers.some(
      (e) => user.user.id === e.data.userId
    );

    if (isUserTyping) {
      toggleUserTyping("stop");
    }

    scrollToBottom({ smooth: true });

    socket.send(JSON.stringify(newMessageEvent));
  };

  const toggleUserTyping = (status: UserTypingEvent["data"]["status"]) => {
    if (!user.user || !socket) {
      return;
    }

    const found = typingUsers.some((e) => user.user.id === e.data.userId);
    if ((status === "start" && found) || (status === "stop" && !found)) {
      return;
    }

    const typingEvent: UserTypingEvent = {
      __type: "USER_TYPING",
      data: {
        status,
        userId: user.user.id,
        startedAt: new Date(),
      },
    };

    socket.send(JSON.stringify(typingEvent));
  };

  const scrollToBottom = useCallback((args?: { smooth?: boolean }) => {
    requestAnimationFrame(() => {
      if (bottom.current) {
        bottom.current.scrollIntoView({
          inline: "end",
          block: "end",
          behavior: args?.smooth ? "smooth" : "instant",
        });
      }
    });
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
        .with({ __type: "USER_TYPING" }, (val) => {
          if (val.data.status === "start") {
            setTypingUsers((prev) => [...prev, val]);
          } else {
            setTypingUsers((prev) =>
              prev.filter((e) => e.data.userId !== val.data.userId)
            );
          }
          setTimeout(() => {
            scrollToBottom({ smooth: true });
          }, 20);
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
    <div className="flex-1 flex flex-col mx-auto w-full max-w-4xl relative">
      <div className="py-2">
        <h1 className="font-bold text-lg text-center">{props.eventName}</h1>
        <p className="text-center">{props.eventLocation}</p>
      </div>
      <div className="flex-1 relative flex flex-col gap-1 text-sm">
        <div className="flex-1 relative">
          <div className="absolute inset-0 flex flex-col gap-1 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-900">
            {events
              .filter(
                (event): event is ChatMessageEvent | ChatErrorEvent =>
                  event.__type === "CHAT_MESSAGE" || event.__type === "ERROR"
              )
              .map((event, i) => (
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
        <TypingUsersList typingUsers={typingUsers} />

        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (userInput.current) {
              await sendMessage(userInput.current.value);
              userInput.current.value = "";
            }
          }}
          className="flex gap-2 py-2 px-2 sm:px-0 w-full bg-neutral-900/90 backdrop-blur z-50 sm:mx-auto sm:max-w-4xl"
        >
          <Input
            ref={userInput}
            onChange={async (e) => {
              toggleUserTyping(e.target.value.length > 0 ? "start" : "stop");
            }}
          />

          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
};

const TypingUsersList: FC<{ typingUsers: UserTypingEvent[] }> = (props) => {
  const user = useUser();
  const { data: users = [] } = trpc.auth.getUsers.useQuery(
    {
      userIds: props.typingUsers.map((e) => e.data.userId),
    },
    {
      keepPreviousData: true,
      select: (data) =>
        data
          .filter((e) => e.id !== user.user?.id)
          .map((e) => ({
            user: e,
            event: props.typingUsers.find((u) => u.data.userId === e.id),
          })),
    }
  );

  return (
    <AnimatePresence>
      {users.length > 0 && (
        <motion.div
          className="overflow-hidden h-12"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.15, type: "spring" }}
        >
          <div className="p-2 h-full">
            <div className="relative h-full">
              <AnimatePresence>
                {users
                  .sort(
                    (a, b) =>
                      (a.event?.data.startedAt ?? new Date()).getTime() -
                      (b.event?.data.startedAt ?? new Date()).getTime()
                  )
                  .map((e, i) => (
                    <motion.div
                      initial={{ y: users.length === 1 ? "-50%" : "100%" }}
                      animate={{ y: "-50%" }}
                      exit={{ y: "100%" }}
                      className="absolute top-1/2"
                      style={{
                        left: `${20 * i}px`,
                      }}
                      key={`typing ${e.user.id}`}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={e.user.imageUrl}
                          width={50}
                          height={50}
                          alt=""
                          loading="eager"
                          priority
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {e.user.role === "admin" && (
                        <div className="absolute -bottom-1 -right-1">
                          <CheckBadgeIcon className="w-5 h-5 text-orange-500 relative rounded-full z-10" />
                          <div className="bg-white w-3 h-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute rounded-full z-0" />
                        </div>
                      )}
                    </motion.div>
                  ))}
              </AnimatePresence>
              <div
                className="h-10 flex items-end absolute gap-px"
                style={{
                  left: `${20 * users.length + 30}px`,
                }}
              >
                {[...Array.from({ length: 3 })].map((_, i) => (
                  <motion.div
                    key={`dot ${i}`}
                    className="w-1.5 h-1.5 bg-neutral-400 rounded-full mb-1"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      repeatDelay: 2,
                      duration: 0.3,
                      delay: 0.05 * i,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MessageEventView: FC<{
  event: ChatMessageEvent;
}> = (props) => {
  const { data: senderData } = trpc.auth.getUser.useQuery({
    userId: props.event.data.userId,
  });
  const user = useUser();

  return (
    <div
      className={cn(
        "rounded-2xl p-3 flex w-full items-start gap-4",
        props.event.data.userId === user.user?.id
          ? "bg-blue-500"
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
              loading="eager"
              priority
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {senderData?.role === "admin" && (
          <div className="absolute -bottom-1 -right-1">
            <CheckBadgeIcon className="w-5 h-5 text-orange-500 relative rounded-full z-10" />
            <div className="bg-white w-3 h-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute rounded-full z-0" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-px">
        <div className="flex items-center gap-4">
          <p className="font-semibold">{senderData?.name}</p>
          <p className="text-neutral-200 text-xs">
            <ClientDate
              date={props.event.data.createdAt}
              calendar={true}
              format="DD/MM [at] hh:MM z"
            />
          </p>
        </div>
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
                <div className="w-full h-64">
                  <Image
                    className={cn(className, "h-full w-full object-contain")}
                    src={src ?? ""}
                    alt=""
                    width={500}
                    height={500}
                  />
                </div>
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
