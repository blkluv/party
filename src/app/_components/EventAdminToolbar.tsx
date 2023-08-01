"use client";

import { Cog8ToothIcon, TrashIcon } from "@heroicons/react/24/outline";
import { DialogClose } from "@radix-ui/react-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FC } from "react";
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

export const EventAdminToolbar: FC<{ eventId: number; eventSlug: string }> = (
  props
) => {
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
          <Button variant="ghost">
            <TrashIcon className="w-4 h-4" />
          </Button>
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
      <Link href={`/events/${props.eventSlug}/manage`}>
        <Button variant="ghost">
          <Cog8ToothIcon className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};
