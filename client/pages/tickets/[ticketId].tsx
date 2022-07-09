import { useAuthenticator } from "@aws-amplify/ui-react";
import { NextPageContext } from "next";
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

const Page = ({ status, customerName, event, ticketQuantity, receiptUrl, used: initialUses }: Props) => {
  const [path, setPath] = useState("");
  const { user } = useAuthenticator();
  const [used, setUsed] = useState(initialUses);

  useEffect(() => {
    setPath(window.location.href);
  }, []);

  const updateTicketUse = useCallback(async () => {
    try {
      await Promise.resolve(null);
      setUsed(used + 1);
    } catch (error) {
      console.error(error);
    }
  }, [used]);

  useEffect(() => {
    if (user && isUserAdmin(user)) {
      updateTicketUse();
    }
  }, [user, updateTicketUse]);

  if (path.length === 0) return <LoadingScreen />;

  return (
    <div className="mx-auto max-w-2xl w-full gap-4 flex flex-col items-center">
      <MetaData title={`${customerName}'s Ticket`} />
      <QRCode value={window.location.href} className="mx-auto" />
      <div className="flex gap-4 items-center justify-center">
        <div className={`rounded-full py-0.5 text-center px-4 ${statusColor[status]} max-w-sm`}>
          <p>{statusTranslation[status]}</p>
        </div>
        {Boolean(used > 0) && isUserAdmin(user) && (
          <div className={`rounded-full py-0.5 text-center px-4 bg-rose-600 max-w-sm`}>
            <p>Ticket Used</p>
          </div>
        )}
      </div>
      <div>
        <h1 className="font-bold text-3xl text-center">{customerName}</h1>
        <p className="font-bold text-center">
          {ticketQuantity}x - {event?.name}{" "}
        </p>
      </div>

      <a href={receiptUrl} target="_blank" rel="noreferrer">
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
