"use client";

import { QrCodeIcon } from "@heroicons/react/24/outline";
import type { inferProcedureOutput } from "@trpc/server";
import dayjs from "dayjs";
import type { FC } from "react";
import { ClientDate } from "~/app/_components/ClientDate";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Label } from "~/app/_components/ui/label";
import type { AppRouter } from "~/app/api/trpc/trpc-router";
import { trpc } from "~/utils/trpc";

export const TicketScansList: FC<{
  ticketId: string;
  eventId: string;
}> = (props) => {
  const {
    data: scans = [],
    isLoading: isScansLoading,
    isFetched,
  } = trpc.events.tickets.scans.getAllTicketScans.useQuery({
    eventId: props.eventId,
    ticketId: props.ticketId,
  });

  // Can't scan more than once every 5 mins
  const isScanButtonEnabled =
    isFetched &&
    (scans.length > 0
      ? dayjs().diff(scans[0].createdAt) <
        dayjs().add(5, "minute").get("millisecond")
      : true);

  const { mutateAsync: scanTicket, isLoading: isCreateScanLoading } =
    trpc.events.tickets.scans.createTicketScan.useMutation();

  return (
    <>
      <button
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 font-semibold flex justify-center gap-4 items-center rounded-2xl shadow-white shadow-lg transition hover:shadow-neutral-300 w-full md:w-72 md:mx-auto disabled:opacity-50 disabled:pointer-events-none"
        disabled={!isScanButtonEnabled}
        onClick={async () => {
          await scanTicket({
            eventId: props.eventId,
            ticketId: props.ticketId,
          });
        }}
      >
        <QrCodeIcon className="h-6 w-6" />
        <p>Scan</p>
        {isCreateScanLoading && <LoadingSpinner />}
      </button>
      {scans.length > 0 && (
        <div className="flex flex-col border border border-neutral-800/50 bg-neutral-800/20 shadow-lg rounded-2xl p-4">
          {scans.map((e) => (
            <TicketScan key={e.id} data={e} />
          ))}
        </div>
      )}
      {isScansLoading && <LoadingSpinner className="mx-auto" size={36} />}
    </>
  );
};

const TicketScan: FC<{
  data: inferProcedureOutput<
    AppRouter["events"]["tickets"]["scans"]["getAllTicketScans"]
  >[number];
}> = (props) => {
  const { mutateAsync: deleteScan, isLoading } =
    trpc.events.tickets.scans.deleteScan.useMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-2 flex flex-col gap-1 hover:bg-neutral-800 rounded-xl transition cursor-default">
          <div className="flex gap-4 items-center justify-between">
            <Label>Scanned By</Label>
            <p className="text-xs font-medium text-neutral-300">
              <ClientDate date={props.data.createdAt} calendar />
            </p>
          </div>
          <p>
            {props.data.user.firstName} {props.data.user.lastName}
          </p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete Ticket Scan</DialogTitle>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline">Go Back</Button>
          <Button
            className="gap-2"
            variant="destructive"
            onClick={async () => {
              await deleteScan({
                eventId: props.data.eventId,
                ticketId: props.data.ticketId,
                ticketScanId: props.data.id,
              });
            }}
          >
            <p>Delete</p>
            {isLoading && <LoadingSpinner />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
