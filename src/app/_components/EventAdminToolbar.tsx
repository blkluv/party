"use client";

import { PencilIcon, TicketIcon, TrashIcon } from "@heroicons/react/24/outline";
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
    <div className="flex gap-2 justify-center">
      {(props.role === "admin" || props.role === "manager") && (
        <>
          <Link href={`/events/${props.eventId}/edit`}>
            <Button variant="secondary" className="gap-2">
              <PencilIcon className="w-4 h-4" />
              <p>Edit</p>
            </Button>
          </Link>
          <Link href={`/events/${props.eventId}/tickets`}>
            <Button variant="secondary" className="gap-2">
              <TicketIcon className="w-4 h-4" />
              <p>Tickets</p>
            </Button>
          </Link>
        </>
      )}
      <Dialog>
        <DialogTrigger asChild>
          {props.role === "admin" && (
            <Button variant="secondary" className="gap-2">
              <TrashIcon className="w-4 h-4" />
              <p>Delete</p>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            This action is irreversible and deletes all tickets, promo codes,
            and any other data related to this event.
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
    </div>
  );
};
