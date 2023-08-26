"use client";

import {
  ArrowLeftIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, type FC } from "react";
import { ClientDate } from "~/app/_components/ClientDate";
import { cn } from "~/utils/shadcn-ui";
import { JoinDiscussionButton } from "./join-discussion-button";

export const EventDescription: FC<{ text: string; defaultOpen?: boolean }> = (
  props
) => {
  const [open, setOpen] = useState(props.defaultOpen ?? false);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold">Description</h3>
      <motion.div
        initial={{ height: "48px" }}
        animate={{ height: open ? "auto" : "48px" }}
        className="overflow-hidden"
      >
        <div>
          <p className="whitespace-pre-wrap">
            {open
              ? props.text
              : `${props.text
                  .split(/\s/)
                  .slice(0, 20)
                  .join(" ")
                  .slice(0, 75)}...`}
          </p>
        </div>
      </motion.div>
      {!open && (
        <button onClick={() => setOpen(true)} className="text-left w-max">
          <p className="text-orange-300">Read More</p>
        </button>
      )}
    </div>
  );
};

export const MobileEventHeader: FC<{
  posterUrl: string;
  name: string;
  startTime: Date;
  eventId: string;
  isDiscussionEnabled: boolean;
}> = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Link
        href="/"
        className="flex items-center justify-center absolute top-6 left-6 z-20 p-2"
      >
        <ArrowLeftIcon className="w-6 h-6 text-white" />
      </Link>
      <div className="right-6 top-6 absolute z-20">
        <JoinDiscussionButton
          eventId={props.eventId}
          disabled={!props.isDiscussionEnabled}
        >
          <button
            disabled={!props.isDiscussionEnabled}
            className="p-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <div className="relative">
              <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
              <div className="animate-pulse absolute bg-green-500 rounded-full w-2 h-2 top-0 right-0 translate-x-1/4 -translate-y-1/4" />
            </div>
          </button>
        </JoinDiscussionButton>
      </div>
      <motion.div
        className="relative w-full overflow-hidden"
        initial={{ height: "400px" }}
        animate={{ height: open ? "100vh" : "400px" }}
        onClick={() => setOpen((o) => !o)}
      >
        <div
          className={cn(
            "absolute inset-x-0 -inset-y-px bg-gradient-to-b from-transparent to-neutral-900 z-10 transition",
            open ? "opacity-0" : "opacity-100"
          )}
        />
        <Image
          src={props.posterUrl}
          width={1200}
          height={1200}
          alt=""
          className="w-full object-top transition duration-300"
        />
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-4">
          <h1 className="font-semibold text-2xl">{props.name}</h1>
          <div className="flex items-center justify-start gap-8">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              <p className="text-sm text-gray-200">
                <ClientDate date={props.startTime} format="dddd, MMMM D" />
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              <p className="text-sm text-gray-200">
                <ClientDate date={props.startTime} format="h:mm a" />
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
