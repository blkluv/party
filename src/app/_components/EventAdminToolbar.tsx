"use client";

import {
  Cog8ToothIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { DialogClose } from "@radix-ui/react-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import type { EVENT_ROLES } from "~/db/schema";
import { trpc } from "~/utils/trpc";
import { LoadingSpinner } from "./LoadingSpinner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export const EventAdminToolbar: FC<{
  eventId: string;
  role: (typeof EVENT_ROLES)[number] | null;
}> = (props) => {
  const { push, refresh } = useRouter();
  const { mutate: deleteEvent, isLoading: isEventDeleting } =
    trpc.events.deleteEvent.useMutation({
      onSuccess: () => {
        refresh();
        push("/");
      },
    });

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          {props.role === "admin" && (
            <Button variant="ghost">
              <TrashIcon className="w-4 h-4" />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            This action is irreversible and deletes all tickets, coupons, and
            any other data related to this event.
          </DialogDescription>

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Go Back</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => deleteEvent({ eventId: props.eventId })}
            >
              <p>Delete</p>
              {isEventDeleting && <LoadingSpinner className="ml-2" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Link href={`/events/${props.eventId}/manage`}>
        <Button variant="ghost">
          <Cog8ToothIcon className="w-4 h-4" />
        </Button>
      </Link>
      {props.role === "admin" && (
        <Link href={`/events/${props.eventId}/edit`}>
          <Button variant="ghost">
            <PencilIcon className="w-4 h-4" />
          </Button>
        </Link>
      )}
    </div>
  );
};
