import { Button } from "@conorroberts/beluga";
import { PartyBoxEventTicket } from "@party-box/common";
import Link from "next/link";
import { FC } from "react";
import { WEBSITE_URL } from "~/config/config";

interface TicketTableProps {
  tickets: PartyBoxEventTicket[];
}

const TicketsTable: FC<TicketTableProps> = ({ tickets }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone Number</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr key={`ticket ${ticket.id}`}>
            <td>{ticket.customerName}</td>
            <td>{ticket.customerPhoneNumber}</td>
            <td>{ticket.customerEmail}</td>
            <td>{`${WEBSITE_URL}tickets/${ticket.stripeSessionId}`}</td>
            <td className="flex justify-end items-center gap-4">
              <Button>Refund</Button>
              <Link href={`${WEBSITE_URL}tickets/${ticket.stripeSessionId}`} passHref>
                <a>
                  <Button>View</Button>
                </a>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TicketsTable;
