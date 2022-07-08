import Image from "next/image";
import Link from "next/link";
import PartyBoxEvent from "~/types/PartyBoxEvent";
import { motion } from "framer-motion";

interface Props {
  event: PartyBoxEvent;
}

const EventPreview = ({ event }: Props) => {
  return (
    <Link href={`/events/${event.id}`} passHref>
      <motion.div
        className="flex flex-col md:flex-row rounded-xl shadow-md border border-gray-800 overflow-hidden cursor-pointer"
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.075 },
        }}
        transition={{
          type: "spring",
          damping: 10,
          stiffness: 100,
        }}
      >
        <div className="relative h-72 md:min-h-[150px] md:h-auto w-full md:flex-1 overflow-hidden">
          {event.thumbnail_url && <Image src={event.thumbnail_url} alt="Poster" layout="fill" objectFit="cover" />}
        </div>
        <div className="p-3 flex flex-col gap-2 md:flex-1">
          <div className="flex items-center justify-between flex-col">
            <h4 className="font-bold text-xl md:text-2xl">{event.name}</h4>
            <p className="text-sm">
              {new Date(event.start_time).toDateString()} at {new Date(event.start_time).toLocaleTimeString()}
            </p>
          </div>
          <p className="text-sm">{event.description}</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default EventPreview;
