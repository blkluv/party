import Image from "next/image";
import Link from "next/link";
import PartyBoxEvent from "~/types/PartyBoxEvent";
import { Button } from "./form";

interface Props {
  event: PartyBoxEvent;
}

const EventPreview = ({ event }: Props) => {
  return (
    <div className="flex flex-col rounded-xl shadow-md border border-gray-800 overflow-hidden">
      <div className="relative h-64 w-96 overflow-hidden">
        {event.poster_url && <Image src={event.poster_url} alt="Poster" layout="fill" objectFit="cover" />}
      </div>
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h4 className="font-bold">{event.name}</h4>
          <p className="text-sm">
            {new Date(event.start_time).toDateString()} at {new Date(event.start_time).toLocaleTimeString()}
          </p>
        </div>
        <p className="text-sm">{event.description}</p>

        <div className="flex justify-center">
          <Link href={`/events/${event.id}`} passHref>
            <div>
              <Button variant="outline">Get Tickets</Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventPreview;
