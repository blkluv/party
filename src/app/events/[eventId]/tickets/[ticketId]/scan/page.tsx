import { auth, clerkClient } from "@clerk/nextjs";
import { TicketIcon } from "@heroicons/react/24/outline";
import { and, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense, cache } from "react";
import { Label } from "~/app/_components/ui/label";
import { getDb } from "~/db/client";
import { tickets } from "~/db/schema";
import { getPageTitle } from "~/utils/getPageTitle";
import { getUserEventRole } from "~/utils/getUserEventRole";
import { isRoleAllowed } from "~/utils/permissions";
import { TicketScansList } from "./ticket-scans-list";

type PageProps = {
  params: { ticketId: string; eventId: string };
};

export const metadata: Metadata = {
  title: getPageTitle("Scan Ticket"),
};

export const dynamic = "force-dynamic";

const getRole = cache(getUserEventRole);

const Page = async (props: PageProps) => {
  return (
    <div className="w-full mx-auto max-w-xl flex-1 p-2 flex flex-col gap-8">
      <Suspense>
        <TicketInfoView
          eventId={props.params.eventId}
          ticketId={props.params.ticketId}
        />
      </Suspense>
    </div>
  );
};

const TicketInfoView = async (props: { ticketId: string; eventId: string }) => {
  const userAuth = auth();

  if (!userAuth?.userId) {
    redirect(`/events/${props.eventId}`);
  }

  const role = await getRole(props.eventId);

  if (!isRoleAllowed(role, "TICKETS_SCAN")) {
    redirect(`/events/${props.eventId}`);
  }

  const db = getDb();

  const ticket = await db.query.tickets.findFirst({
    where: and(
      eq(tickets.id, props.ticketId),
      eq(tickets.eventId, props.eventId)
    ),
    with: {
      event: {
        columns: {
          name: true,
        },
      },
      price: {
        columns: {
          name: true,
        },
      },
    },
  });

  if (!ticket) {
    redirect(`/events/${props.eventId}`);
  }

  const user = await clerkClient.users.getUser(ticket.userId);

  return (
    <>
      <div className="rounded-2xl bg-neutral-800/20 border border-neutral-800/50 shadow-lg flex flex-col gap-4 p-4">
        <div className="flex justify-between gap-2">
          <p className="text-xl font-bold">
            {ticket ? ticket.event.name : "Ticket Not Found"}
          </p>
          <TicketIcon className="w-6 h-6" />
        </div>
        {ticket && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Name</Label>
              <p className="text-sm">{`${user.firstName} ${user.lastName}`}</p>
            </div>
            <div>
              <Label>Quantity</Label>
              <p className="text-sm">x{ticket.quantity}</p>
            </div>
            <div>
              <Label>Tier</Label>
              <p className="text-sm">{ticket.price?.name}</p>
            </div>
          </div>
        )}
      </div>
      {ticket && (
        <TicketScansList eventId={props.eventId} ticketId={props.ticketId} />
      )}
    </>
  );
};

export default Page;
