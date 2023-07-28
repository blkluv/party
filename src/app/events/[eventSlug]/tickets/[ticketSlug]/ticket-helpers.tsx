"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";

export const TicketInfoButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <p>Info</p>
          <InformationCircleIcon className="ml-2 w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Ticket Information</DialogTitle>
        <DialogDescription>
          Here&apos;s what you need to know about your ticket.
        </DialogDescription>
        <p>The event location will be released 1h before the event begins</p>
      </DialogContent>
    </Dialog>
  );
};
