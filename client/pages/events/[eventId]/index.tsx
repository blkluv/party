/* eslint-disable @next/next/no-img-element */
import { NextPageContext } from "next";
import TicketsForm from "~/components/TicketsForm";
import { API_URL } from "~/config/config";
import PartyBoxEvent from "~/types/PartyBoxEvent";

interface Props {
  event: PartyBoxEvent;
}

const Page = ({ event }: Props) => {
  console.log(event);
  return (
    <div className="flex flex-col mx-auto max-w-3xl w-full">
      <div className="relative overflow-hidden rounded-md">
        {event.poster_url && <img src={event.poster_url} alt="Poster" loading="eager" />}
      </div>
      <div className="p-3 flex flex-col gap-6">
        <div>
          <h2 className="font-bold text-3xl text-center">{event.name}</h2>
          <p className="text-sm text-center mt-1">
            {new Date(event.start_time).toDateString()} at {new Date(event.start_time).toLocaleTimeString()}
          </p>
        </div>
        <p className="text-sm">{event.description}</p>

        <h3 className="font-bold text-xl text-center">Get Tickets</h3>
        <TicketsForm event={event} />
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const { eventId } = context.query;

  const data = await fetch(`${API_URL}/events/${eventId}`, { method: "GET" });
  const event = await data.json();
  return {
    props: {
      event,
    },
  };
};

export default Page;
