import Image from "next/image";
import Link from "next/link";
import { PartyBoxEvent } from "@party-box/common";
import { motion } from "framer-motion";

interface Props {
  event: PartyBoxEvent;
}

const EventPreview = ({ event }: Props) => {
  return (
    <Link href={`/events/${event.id}`} passHref>
      <motion.a
        className="flex flex-col md:flex-row rounded-xl shadow-md border border-gray-800 overflow-hidden cursor-pointer group"
        whileHover={{
          scale: 1.01,
          transition: { duration: 0.075 },
        }}
        whileTap={{
          scale: 0.99,
          transition: { duration: 0.075 },
        }}
        transition={{
          type: "spring",
          damping: 10,
          stiffness: 100,
        }}
      >
        <div className="relative h-72 md:h-96 w-full md:flex-1 overflow-hidden">
          {event.thumbnail && (
            <Image src={event.thumbnail} alt="Poster" layout="fill" objectFit="cover" loading="eager" priority />
          )}
          <div className="p-2 flex flex-col gap-2 absolute left-4 right-4 bottom-4 bg-gray-900 backdrop-blur-sm bg-opacity-75 backdrop-filter rounded-xl">
            <div className="flex flex-col">
              <h4 className="font-medium text-lg md:text-2xl text-center">{event.name}</h4>
              <p className="text-sm text-center">{new Date(event.startTime).toDateString()}</p>
            </div>
          </div>
        </div>
      </motion.a>
    </Link>
  );
};

export default EventPreview;
