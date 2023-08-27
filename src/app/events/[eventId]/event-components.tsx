"use client";

import {
  ArrowLeftIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
  Cog6ToothIcon,
  LinkIcon,
  PencilIcon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { useState, type FC } from "react";
import { ClientDate } from "~/app/_components/ClientDate";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/app/_components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import type { EventRole } from "~/db/schema";
import { cn } from "~/utils/shadcn-ui";

export const EventDescription: FC<{ text: string; defaultOpen?: boolean }> = (
  props
) => {
  const [open, setOpen] = useState(props.defaultOpen ?? false);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold">Description</h3>
      <motion.div
        initial={{ height: open ? "auto" : "48px" }}
        animate={{ height: open ? "auto" : "48px" }}
        className="overflow-hidden"
      >
        <p className="whitespace-pre-wrap">
          {open
            ? props.text
            : `${props.text
                .split(/\s/)
                .slice(0, 20)
                .join(" ")
                .slice(0, 75)}...`}
        </p>
      </motion.div>
      <AnimatePresence>
        {!open && (
          <motion.button
            onClick={() => !open && setOpen(true)}
            className="text-left w-max"
            exit={{ opacity: "0", height: "0" }}
          >
            <p className="text-orange-300">Read More</p>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MobileEventHeader: FC<{
  posterUrl: string;
  name: string;
  startTime: Date;
  eventId: string;
  isDiscussionEnabled: boolean;
  role: EventRole["role"] | null;
}> = (props) => {
  return (
    <div className="relative lg:w-1/3 lg:rounded-2xl h-max lg:sticky lg:top-[90px] lg:bg-neutral-800/20 lg:border lg:border-neutral-800/50 lg:shadow-lg">
      <div className="lg:hidden">
        <Link
          href="/"
          className="flex items-center justify-center absolute top-6 left-6 z-20 p-2"
        >
          <ArrowLeftIcon className="w-6 h-6 text-white" />
        </Link>
        <div className="right-6 top-6 absolute z-20 flex gap-2">
          {(props.role === "manager" || props.role === "admin") && (
            <EventManagementDropdown
              role={props.role}
              eventId={props.eventId}
            />
          )}
          {props.isDiscussionEnabled ? (
            <Link href={`/events/${props.eventId}/chat`}>
              <JoinDiscussionButton disabled={false} />
            </Link>
          ) : (
            <JoinDiscussionAlertDialog>
              <JoinDiscussionButton disabled={true} />
            </JoinDiscussionAlertDialog>
          )}
        </div>
      </div>
      <Image
        src={props.posterUrl}
        width={1200}
        height={1200}
        alt=""
        className="rounded-2xl max-h-[700px] md:max-h-[900px] w-auto hidden lg:block"
      />
      <div className="lg:block hidden mt-2 p-4 lg:shadow-lg">
        <EventDetails name={props.name} startTime={props.startTime} />
      </div>
      <AnimatedImageContainer className="lg:hidden">
        <Image
          src={props.posterUrl}
          width={1200}
          height={1200}
          alt=""
          className="w-full object-top transition duration-300 rounded-b-xl"
        />
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-4 lg:hidden">
          <EventDetails name={props.name} startTime={props.startTime} />
        </div>
      </AnimatedImageContainer>
    </div>
  );
};

const EventDetails: FC<{ name: string; startTime: Date }> = (props) => {
  return (
    <>
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
    </>
  );
};

const AnimatedImageContainer: FC<PropsWithChildren<{ className?: string }>> = (
  props
) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className={cn("relative w-full overflow-hidden", props.className)}
      initial={{ height: "400px" }}
      animate={{ height: open ? "100vh" : "400px" }}
      onClick={() => setOpen((o) => !o)}
    >
      <div
        className={cn(
          "absolute inset-x-0 -inset-y-px bg-gradient-to-b from-transparent to-neutral-900 z-10 transition lg:hidden",
          open ? "opacity-0" : "opacity-100"
        )}
      />
      {props.children}
    </motion.div>
  );
};

const JoinDiscussionButton: FC<{ disabled: boolean }> = (props) => {
  return (
    <button
      className={cn(
        "p-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
        props.disabled && "pointer-events-none opacity-50"
      )}
    >
      <div className="relative">
        <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
        <div className="animate-pulse absolute bg-green-500 rounded-full w-2 h-2 top-0 right-0 translate-x-1/4 -translate-y-1/4" />
      </div>
    </button>
  );
};

export const JoinDiscussionAlertDialog: FC<PropsWithChildren> = (props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ticket Required</AlertDialogTitle>
          <AlertDialogDescription>
            Purchase a ticket for this event to join the live discussion.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const EventManagementDropdown: FC<{
  role: EventRole["role"] | null;
  className?: string;
  eventId: string;
}> = (props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn("flex items-center justify-center p-2", props.className)}
      >
        <Cog6ToothIcon className="w-6 h-6 text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {props.role === "admin" && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/events/${props.eventId}/manage`}>
                <PencilIcon className="w-4 h-4 mr-2" />
                <p>Edit</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserGroupIcon className="w-4 h-4 mr-2" />
              <p>Roles</p>
            </DropdownMenuItem>
          </>
        )}
        {(props.role === "manager" || props.role === "admin") && (
          <>
            <DropdownMenuItem>
              <TicketIcon className="w-4 h-4 mr-2" />
              <p>Tickets</p>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LinkIcon className="w-4 h-4 mr-2" />
              <p>Promotions</p>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
