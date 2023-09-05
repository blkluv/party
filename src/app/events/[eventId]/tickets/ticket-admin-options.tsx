"use client";

import {
  EllipsisHorizontalIcon,
  QrCodeIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { ClientDate } from "~/app/_components/ClientDate";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/app/_components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import { trpc } from "~/utils/trpc";

export const TicketAdminOptionsDropdown: FC<
  PropsWithChildren<{ ticketId: string; eventId: string }>
> = (props) => {
  const [showRefundDialog, setShowRefundDialog] = useState(false);

  const { mutateAsync: refundTicket, isLoading: isRefundLoading } =
    trpc.events.tickets.refundTicket.useMutation({
      onSuccess: async () => {
        setShowRefundDialog(false);
      },
    });

  return (
    <>
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogTitle>Refund Ticket</DialogTitle>
          <DialogDescription>
            By issuing a refund for this ticket, access will be revoked, and the
            user&apos;s payment will be returned.
          </DialogDescription>

          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline">Go Back</Button>
            <Button
              onClick={async () => {
                await refundTicket({
                  eventId: props.eventId,
                  ticketId: props.ticketId,
                });
              }}
            >
              <p>Refund</p>
              {isRefundLoading && <LoadingSpinner />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="gap-2"
            onSelect={() => {
              setShowRefundDialog(true);
            }}
          >
            <ReceiptRefundIcon className="w-4 h-4" />
            <p>Refund</p>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/events/${props.eventId}/tickets/${props.ticketId}/scan`}
            >
              <QrCodeIcon className="w-4 h-4 mr-2" />
              <p>Scan</p>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const TicketsTable: FC<{ eventId: string }> = (props) => {
  const {
    data: foundTickets = [],
    isFetching,
    refetch,
  } = trpc.events.tickets.getAllTickets.useQuery({ eventId: props.eventId });

  const totalTickets = useMemo(() => {
    return foundTickets.reduce((sum, e) => sum + e.quantity, 0);
  }, [foundTickets]);

  const {
    mutateAsync: syncTickets,
    isSuccess: isSyncSuccess,
    isLoading: isSyncFetching,
  } = trpc.events.tickets.sync.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  useEffect(() => {
    if (!isSyncSuccess && !isSyncFetching) {
      syncTickets({ eventId: props.eventId });
    }
  }, [syncTickets, props.eventId, isSyncFetching, isSyncSuccess]);

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-center">Tickets</h1>
        <div className="bg-neutral-800 text-sm font-semibold mx-auto text-center px-4 py-1 rounded-full">
          <p>{totalTickets}</p>
        </div>
      </div>
      <Table>
        <TableCaption>A list of tickets purchased for this event.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="hidden sm:table-cell">Purchased At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foundTickets.map((e) => (
            <TableRow key={e.id}>
              <TableCell>
                {e.user.firstName} {e.user.lastName}
              </TableCell>
              <TableCell>{e.quantity}</TableCell>
              <TableCell className="hidden sm:table-cell">
                <ClientDate date={e.createdAt} calendar />
              </TableCell>
              <TableCell>
                <TicketAdminOptionsDropdown
                  eventId={props.eventId}
                  ticketId={e.id}
                >
                  <Button variant="ghost" size="sm">
                    <EllipsisHorizontalIcon className="w-5 h-5" />
                  </Button>
                </TicketAdminOptionsDropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isFetching && (
        <div className="flex justify-center">
          <LoadingSpinner className="mx-auto" size={30} />
        </div>
      )}
    </>
  );
};
