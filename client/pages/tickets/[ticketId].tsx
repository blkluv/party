import { useAuthenticator } from "@aws-amplify/ui-react";
import axios from "axios";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "~/components/form";
import LoadingScreen from "~/components/LoadingScreen";
import MetaData from "~/components/MetaData";
import { API_URL } from "~/config/config";
import PartyBoxEvent from "~/types/PartyBoxEvent";
import isUserAdmin from "~/utils/isUserAdmin";

interface Props {
  status: "succeeded" | "failed" | "pending";
  customerPhoneNumber: string;
  customerName: string;
  ticketQuantity: number;
  event: PartyBoxEvent;
  used: number;
  receiptUrl: string;
}

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

const Page = (props: Props) => {
  const [path, setPath] = useState("");
  const { user } = useAuthenticator();
  const [used, setUsed] = useState(props.used ?? 0);
  const [ticket, setTicket] = useState(props);
  const [loading, setLoading] = useState(true);
  const [loadTries, setLoadTries] = useState(0);
  const { query } = useRouter();

  const updateTicketUse = useCallback(async () => {
    try {
      await Promise.resolve(null);
      setUsed(used + 1);
    } catch (error) {
      console.error(error);
    }
  }, [used]);

  const getTicket = useCallback(async () => {
    if (loadTries > 3) return;

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/tickets/${query.ticketId}`);

      setTicket(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadTries((prev) => prev + 1);
    }
  }, [query.ticketId, loadTries]);

  useEffect(() => {
    setPath(window.location.href);
  }, []);

  useEffect(() => {
    // If we didn't get ticket data, try every 1s (3 times) to get it again
    const timer = setInterval(() => {
      if (!props) {
        getTicket();
      }
    }, 1000);

    // If we have some ticket data, stop trying to get it
    if (props) {
      clearInterval(timer);
      setLoading(false);
    }

    return () => {
      clearInterval(timer);
    };
  }, [props, query.ticketId, getTicket]);

  useEffect(() => {
    if (user && isUserAdmin(user)) {
      updateTicketUse();
    }
  }, [user, updateTicketUse]);

  if (loadTries > 3) return <h2 className="font-bold text-center text-xl my-4">Couldn&apos;t find ticket</h2>;

  if (path.length === 0 || loading || !ticket) return <LoadingScreen />;

  return (
    <div className="mx-auto max-w-2xl w-full gap-4 flex flex-col items-center">
      <MetaData title={`${ticket.customerName}'s Ticket`} />
      <QRCode value={window.location.href} className="mx-auto" />
      <div className="flex gap-4 items-center justify-center">
        <div className={`rounded-full py-0.5 text-center px-4 ${statusColor[ticket.status]} max-w-sm`}>
          <p>{statusTranslation[ticket.status]}</p>
        </div>
        {Boolean(used > 0) && isUserAdmin(user) && (
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
  const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
    method: "GET",
  });

  const data = await response.json();

  return {
    props: data,
  };
};

export default Page;
