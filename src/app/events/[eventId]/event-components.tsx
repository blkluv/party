"use client";

import { useUser } from "@clerk/nextjs";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  Cog6ToothIcon,
  DocumentCheckIcon,
  LinkIcon,
  PencilIcon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, PropsWithChildren } from "react";
import { useState, type FC } from "react";
import { ClientDate } from "~/app/_components/ClientDate";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { LoginPrompt } from "~/app/_components/login-prompt";
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
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { Label } from "~/app/_components/ui/label";
import { Textarea } from "~/app/_components/ui/textarea";
import type { EventRole } from "~/db/schema";
import { cn } from "~/utils/shadcn-ui";
import { trpc } from "~/utils/trpc";
import { TicketTierListing } from "./TicketTierListing";

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

export const EventHeader: FC<{
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
        </div>
      </div>
      <Image
        src={props.posterUrl}
        width={1200}
        height={1200}
        alt=""
        className="rounded-2xl max-h-[700px] md:max-h-[700px] w-auto hidden lg:block mx-auto"
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

export const JoinDiscussionAlertDialog: FC<PropsWithChildren> = (props) => {
  const user = useUser();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showTicketWarning, setShowTicketWarning] = useState(false);

  return (
    <>
      {showLoginPrompt && <LoginPrompt onOpenChange={setShowLoginPrompt} />}
      <AlertDialog
        onOpenChange={(val) => {
          if (val && !user.isSignedIn) {
            setShowLoginPrompt(true);
            return;
          }

          setShowTicketWarning(val);
        }}
        open={showTicketWarning}
      >
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
    </>
  );
};

export const TicketTiersDialog: FC<
  PropsWithChildren<{
    data: ComponentProps<typeof TicketTierListing>[];
    eventId: string;
  }>
> = (props) => {
  const user = useUser();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showTicketTiers, setShowTicketTiers] = useState(false);
  const [showTicketRepApplication, setShowTicketRepApplication] =
    useState(false);

  return (
    <>
      {showTicketRepApplication && (
        <TicketRepApplicationDialog
          onOpenChange={setShowTicketRepApplication}
          eventId={props.eventId}
        />
      )}
      {showLoginPrompt && <LoginPrompt onOpenChange={setShowLoginPrompt} />}
      <Dialog
        onOpenChange={(val) => {
          if (val && !user.isSignedIn) {
            setShowLoginPrompt(true);
            return;
          }

          setShowTicketTiers(val);
        }}
        open={showTicketTiers}
      >
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent>
          <DialogTitle>Get Tickets</DialogTitle>
          <DialogDescription>
            Grab some tickets for this event!
          </DialogDescription>
          <div className="flex flex-col gap-2">
            {props.data.map((tier) => (
              <TicketTierListing {...tier} key={tier.data.id} />
            ))}
            <Button
              className="gap-2 mx-auto group"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowTicketTiers(false);
                setShowTicketRepApplication(true);
              }}
            >
              <p className="text-sm">Become a ticket rep</p>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const TicketRepApplicationDialog: FC<{
  eventId: string;
  onOpenChange: (val: boolean) => void;
}> = (props) => {
  const { mutateAsync: createRoleRequest, isLoading } =
    trpc.events.roles.requests.createEventRoleRequest.useMutation({
      onSuccess: () => {
        props.onOpenChange(false);
      },
    });
  const { data: existingRequest, isLoading: isExistingRequestLoading } =
    trpc.events.roles.requests.getRoleRequest.useQuery({
      eventId: props.eventId,
    });
  const [message, setMessage] = useState("");

  const isExistingRequestPresent = existingRequest && !isExistingRequestLoading;

  return (
    <Dialog open={true} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogTitle>Become a Ticket Rep</DialogTitle>
        <DialogDescription>
          Becoming a ticket rep for this event gives you access to promotion
          codes, tickets, and more.
        </DialogDescription>
        {!isExistingRequestPresent && (
          <>
            <div className="flex flex-col gap-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Message"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <p className="text-sm text-muted-foreground">
                Tell us a bit about why you want to become a ticket rep for this
                event.
              </p>
            </div>
            <Button
              className="mx-auto gap-2"
              onClick={async () => {
                await createRoleRequest({ eventId: props.eventId, message });
              }}
            >
              <p>Submit</p>
              {isLoading && <LoadingSpinner />}
            </Button>
          </>
        )}
        {isExistingRequestPresent && (
          <>
            {existingRequest.status === "pending" && (
              <p className="my-4 text-sm text-center">
                You already have a pending application. We&apos;ll get back to
                you as fast as we can.
              </p>
            )}
            {existingRequest.status !== "pending" && (
              <p className="my-4 text-sm text-center">
                Your application was {existingRequest.status}.
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
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
              <Link href={`/events/${props.eventId}/edit`}>
                <PencilIcon className="w-4 h-4 mr-2" />
                <p>Edit</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/events/${props.eventId}/roles`}>
                <UserGroupIcon className="w-4 h-4 mr-2" />
                <p>Roles</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/events/${props.eventId}/applications`}>
                <DocumentCheckIcon className="w-4 h-4 mr-2" />
                <p>Applications</p>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        {(props.role === "manager" || props.role === "admin") && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/events/${props.eventId}/tickets`}>
                <TicketIcon className="w-4 h-4 mr-2" />
                <p>Tickets</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/events/${props.eventId}/promotion-codes`}>
                <LinkIcon className="w-4 h-4 mr-2" />
                <p>Promotions</p>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
