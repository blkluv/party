"use client";

import {
  EllipsisHorizontalIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";
import { useState, type FC, type PropsWithChildren } from "react";
import { ClientDate } from "~/app/_components/ClientDate";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { Button } from "~/app/_components/ui/button";
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
  const utils = trpc.useContext();
  const [open, setOpen] = useState(false);

  const { mutateAsync: refundTicket, isLoading: isRefundLoading } =
    trpc.events.tickets.refundTicket.useMutation({
      onSuccess: async () => {
        setOpen(false);
        await utils.events.tickets.getAllTickets.refetch({
          eventId: props.eventId,
        });
      },
    });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="gap-4"
          onSelect={async (e) => {
            e.preventDefault();
            await refundTicket({
              eventId: props.eventId,
              ticketId: props.ticketId,
            });
          }}
        >
          <ReceiptRefundIcon className="w-4 h-4" />
          <p>Refund</p>
          {isRefundLoading && <LoadingSpinner />}
        </DropdownMenuItem>
        {/* <DropdownMenuItem>Scan</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const TicketsTable: FC<{ eventId: string }> = (props) => {
  const { data: foundTickets = [], isLoading } =
    trpc.events.tickets.getAllTickets.useQuery({ eventId: props.eventId });

  return (
    <>
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
      {isLoading && (
        <div className="flex justify-center">
          <LoadingSpinner className="mx-auto" size={30} />
        </div>
      )}
    </>
  );
};
