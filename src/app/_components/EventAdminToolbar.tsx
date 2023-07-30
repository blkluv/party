"use client";

import { Cog8ToothIcon, TrashIcon } from "@heroicons/react/24/outline";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { FC } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export const EventAdminToolbar: FC<{ eventId: number }> = (props) => {
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
        <DialogTrigger>
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
      <ManageEventDialog eventId={props.eventId} />
    </div>
  );
};

const ManageEventDialog: FC<{ eventId: number }> = (props) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost">
          <Cog8ToothIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Manage Event</DialogTitle>
        <Tabs defaultValue="promotion-codes">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="promotion-codes">Promotion Codes</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
          </TabsList>
          <TabsContent value="promotion-codes">
            <ManagePromotionCodes eventId={props.eventId} />
          </TabsContent>
          <TabsContent value="tickets"></TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const ManagePromotionCodes: FC<{ eventId: number }> = (props) => {
  const { data: codes = [] } = trpc.events.getAllPromotionCodes.useQuery({
    eventId: props.eventId,
  });

  return (
    <div>
      {codes.map((e) => (
        <div key={`code ${e.id}`}>{e.name}</div>
      ))}
    </div>
  );
};
