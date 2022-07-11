import { useAuthenticator } from "@aws-amplify/ui-react";
import axios from "axios";
import { NextPageContext } from "next";
import { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "~/components/form";
import LoadingScreen from "~/components/LoadingScreen";
import MetaData from "~/components/MetaData";
import { API_URL } from "~/config/config";
import EventTicket from "~/types/EventTicket";
import getToken from "~/utils/getToken";
import isUserAdmin from "~/utils/isUserAdmin";

const statusColor = {
  succeeded: "bg-emerald-600",
  failed: "bg-rose-600",
  pending: "bg-gray-700",
};

const statusTranslation = {
  pending: "Pending",
  succeeded: "Paid",
  failed: "Not Paid",
};

const Page = ({ ticket: initialTicket }) => {
  const [path, setPath] = useState("");
  const { user } = useAuthenticator();
  const [ticket, setTicket] = useState<EventTicket>(initialTicket);

  const updateTicketUse = useCallback(
    async (value: boolean) => {
      try {
        await axios.post(
          `/api/tickets/${ticket.id}/update-use`,
          { value: true },
          { headers: { Authorization: `Bearer ${getToken(user)}` } }
        );
        setTicket((prev) => ({ ...prev, used: value }));
      } catch (error) {
        console.error(error);
      }
    },
    [ticket.id, user]
  );

  useEffect(() => {
    setPath(window.location.href);
  }, []);

  useEffect(() => {
    if (isUserAdmin(user)) {
      updateTicketUse(true);
    }
  }, [user, updateTicketUse]);

  if (!ticket) return <h2 className="font-bold text-center text-xl my-4">Couldn&apos;t find ticket</h2>;

  if (path.length === 0) return <LoadingScreen />;

  return (
    <div className="mx-auto max-w-2xl w-full gap-4 flex flex-col items-center">
      <MetaData title={`${ticket.customerName}'s Ticket`} />
      <QRCode value={window.location.href} className="mx-auto" />
      <div className="flex gap-4 items-center justify-center">
        <div className={`rounded-full py-0.5 text-center px-4 ${statusColor[ticket.status]} max-w-sm`}>
          <p>{statusTranslation[ticket.status]}</p>
        </div>
        {ticket.used && isUserAdmin(user) && (
          <div className={`rounded-full py-0.5 text-center px-4 bg-rose-600 max-w-sm`}>
            <p>Ticket Used</p>
          </div>
        )}
      </div>
      <div>
        <h1 className="font-bold text-3xl text-center">{ticket.customerName}</h1>
        <p className="font-bold text-center">
          {ticket.ticketQuantity}x - {ticket.event?.name}{" "}
        </p>
      </div>

      <a href={ticket.receiptUrl} target="_blank" rel="noreferrer">
        <Button variant="outline">View Receipt</Button>
      </a>
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const { ticketId } = context.query;

  const data = await fetch(`${API_URL}/tickets/${ticketId}`, { method: "GET" });
  const ticket = await data.json();

  return {
    props: {
      ticket,
    },
  };
};

export default Page;
