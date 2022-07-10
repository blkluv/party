/* eslint-disable @next/next/no-img-element */
import { NextPageContext } from "next";
import Link from "next/link";
import { Button } from "~/components/form";
import MetaData from "~/components/MetaData";
import { API_URL } from "~/config/config";
import PartyBoxEvent from "~/types/PartyBoxEvent";

interface Props {
  event: PartyBoxEvent;
}

const Page = ({ event }: Props) => {
  return (
    <div className="flex flex-col mx-auto max-w-6xl w-full md:flex-row">
      <MetaData title={`${event.name}`} />
      <div className="relative overflow-hidden rounded-md mx-auto md:flex-1">
        {event.posterUrl && <img src={event.posterUrl} alt="Poster" loading="eager" />}
      </div>
      <div className="p-3 flex flex-col gap-6 md:flex-1">
        <div>
          <h2 className="font-bold text-3xl md:text-4xl text-center">{event.name}</h2>
          <p className="text-sm text-center mt-1 md:text-base">
            {new Date(event.startTime).toDateString()} at {new Date(event.startTime).toLocaleTimeString()}
          </p>
        </div>
        <p className="text-sm md:text-base">{event.description}</p>

        <div className="flex justify-center">
          <Link href={event.prices[0].paymentLink} passHref>
            <div>
              <Button>Get Tickets</Button>
            </div>
          </Link>
        </div>
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
