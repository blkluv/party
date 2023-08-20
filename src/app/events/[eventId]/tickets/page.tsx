import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Suspense, cache } from "react";
import { ClientDate } from "~/app/_components/ClientDate";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import { getDb } from "~/db/client";
import type { Ticket } from "~/db/schema";
import { tickets } from "~/db/schema";
import { getUserEventRole } from "~/utils/getUserEventRole";

export const dynamic = "force-dynamic";
type PageProps = { params: { eventId: string } };

const getTickets = cache(async (eventId: string) => {
  const db = getDb();

  const foundTickets = await db.query.tickets.findMany({
    where: and(eq(tickets.eventId, eventId), eq(tickets.status, "success")),
  });

  const users = await clerkClient.users.getUserList({
    userId: foundTickets.map((e) => e.userId),
  });

  return foundTickets
    .map((e) => ({
      ...e,
      user: users.find((u) => u.id === e.userId),
    }))
    .filter((e): e is Ticket & { user: User } => Boolean(e.user))
    .sort((a, b) =>
      `${a.user.firstName} ${a.user.lastName}`.localeCompare(
        `${b.user.firstName} ${b.user.lastName}`
      )
    );
});

const Page = async (props: PageProps) => {
  const eventRole = await getUserEventRole(props.params.eventId);

  if (eventRole !== "manager" && eventRole !== "admin") {
    redirect(`/events/${props.params.eventId}`);
  }

  return (
    <div className="flex flex-col gap-8 sm:py-8 py-4 w-full max-w-xl mx-auto">
      <h1 className="font-semibold text-xl text-center">Tickets</h1>
      <Suspense fallback={<LoadingSpinner size={35} className="mx-auto" />}>
        <TicketsTable eventId={props.params.eventId} />
      </Suspense>
    </div>
  );
};

const TicketsTable = async (props: { eventId: string }) => {
  const foundTickets = await getTickets(props.eventId);

  return (
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
            <TableCell>
              <ClientDate date={e.createdAt} calendar />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Page;
