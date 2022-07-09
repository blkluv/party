import { useAuthenticator } from "@aws-amplify/ui-react";
import { NextPageContext } from "next";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import LoadingScreen from "~/components/LoadingScreen";
import MetaData from "~/components/MetaData";
import { API_URL } from "~/config/config";
import isUserAdmin from "~/utils/isUserAdmin";

interface Props {
  status: "succeeded" | "failed" | "pending";
  customer_phone_number: string;
  customer_name: string;
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

const Page = ({ status, customer_name, customer_phone_number }: Props) => {
  const [path, setPath] = useState("");
  const { user } = useAuthenticator();

  useEffect(() => {
    setPath(window.location.href);
  }, []);

  const updateTicketUse = async () => {
    try {
      await Promise.resolve(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user && isUserAdmin(user)) {
      updateTicketUse();
    }
  }, [user]);

  if (path.length === 0) return <LoadingScreen />;

  return (
    <div className="mx-auto max-w-2xl w-full gap-4 flex flex-col items-center">
      <MetaData title={`${customer_name}'s Ticket`}/>
      <QRCode value={window.location.href} className="mx-auto" />
      <div className={`rounded-full py-0.5 text-center px-4 ${statusColor[status]} max-w-sm`}>
        <p>{statusTranslation[status]}</p>
      </div>
      <div>
        <h1 className="font-bold text-3xl text-center">{customer_name}</h1>
        <h2 className="font-semibold text-xl text-center">{customer_phone_number}</h2>
      </div>
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
