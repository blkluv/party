/* eslint-disable @next/next/no-img-element */
import { NextPageContext } from "next";
import Link from "next/link";
import { Button } from "~/components/form";
import { API_URL } from "~/config/config";
import PartyBoxEvent from "~/types/PartyBoxEvent";

interface Props {
  event: PartyBoxEvent;
}

const Page = ({ event }: Props) => {
  return (
    <div className="flex flex-col mx-auto max-w-3xl w-full">
      <div className="relative overflow-hidden rounded-md mx-auto">
        {event.posterUrl && <img src={event.posterUrl} alt="Poster" loading="eager" />}
      </div>
      <div className="p-3 flex flex-col gap-6">
        <div>
          <h2 className="font-bold text-3xl text-center">{event.name}</h2>
          <p className="text-sm text-center mt-1">
            {new Date(event.startTime).toDateString()} at {new Date(event.startTime).toLocaleTimeString()}
          </p>
        </div>
        <p className="text-sm">{event.description}</p>

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
