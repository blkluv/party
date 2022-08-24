import { useAuthenticator } from "@aws-amplify/ui-react";
import axios from "axios";
import { NextPageContext } from "next";
import { FC, useEffect } from "react";
import QRCode from "react-qr-code";
import { Button } from "@conorroberts/beluga";
import MetaData from "~/components/MetaData";
import { API_URL, WEBSITE_URL } from "~/config/config";
import { PartyBoxEventTicket } from "@party-box/common";
import isUserAdmin from "~/utils/isUserAdmin";
import { CloseIcon, LoadingIcon } from "~/components/Icons";
import { useMutation, useQuery, useQueryClient } from "react-query";

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

interface PageProps {
  ticket: PartyBoxEventTicket;

  // Current URL for the QR code
  path: string;
}

const Page: FC<PageProps> = ({ ticket: initialTicket, path }) => {
  const { user } = useAuthenticator();
  const queryClient = useQueryClient();

  const { data: ticket } = useQuery(
    "getTicketData",
    async () => {
      const { data } = await axios.get<PartyBoxEventTicket>(`/api/tickets/${ticket.stripeSessionId}`);
      return data;
    },
    {
      initialData: initialTicket,
      refetchInterval: 5000,
    }
  );

  const { mutate: updateTicketUse, isLoading: ticketUseUpdateLoading } = useMutation(
    "updateTicketUse",
    async (value: boolean) => {
      if (!isUserAdmin(user)) return;

      await axios.post(`/api/tickets/${ticket.stripeSessionId}/update-use`, { value });

      queryClient.refetchQueries("getTicketData");
    }
  );

  useEffect(() => {
    updateTicketUse(true);
  }, [user, updateTicketUse]);

  return (
    <div className="mx-auto max-w-2xl w-full gap-4 flex flex-col items-center">
      {!ticket && (
        <>
          <MetaData title={`No ticket`} />
          <h2 className="font-bold text-center text-xl my-4">Couldn&apos;t find ticket</h2>
        </>
      )}

      {ticket && (
        <>
          <MetaData title={`${ticket.customerName}'s Ticket`} />
          <QRCode value={path} className="mx-auto" />
          <div className="flex gap-4 items-center justify-center">
            <div className={`rounded-full py-0.5 text-center px-4 ${statusColor[ticket.status]} max-w-sm`}>
              <p>{statusTranslation[ticket.status]}</p>
            </div>
            {ticket.used && (
              <div className={`rounded-full py-0.5 text-center px-4 bg-rose-600 max-w-sm flex gap-2 items-center`}>
                <p>Ticket Used</p>

                {ticketUseUpdateLoading && <LoadingIcon size={18} className="animate-spin" />}

                {isUserAdmin(user) && !ticketUseUpdateLoading && (
                  <CloseIcon
                    onClick={() => updateTicketUse(false)}
                    size={18}
                    className="cursor-pointer hover:text-gray-100 transition"
                  />
                )}
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
            <Button variant="outlined">View Receipt</Button>
          </a>
        </>
      )}
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const { ticketId } = context.query;

  const data = await fetch(`${API_URL}/tickets/${ticketId}`, { method: "GET" });

  if (!data.ok) {
    // Couldn't find ticket. Get out of here.
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ticket = await data.json();

  return {
    props: {
      ticket,
      path: WEBSITE_URL.concat(context.req.url.slice(1)),
    },
  };
};

export default Page;
