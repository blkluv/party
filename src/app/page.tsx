import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { getPublicEvents } from "~/utils/getPublicEvents";

export const dynamic = true;

const Page = async () => {
  const foundEvents = await getPublicEvents();

  return (
    <div className="flex-1 flex flex-col p-2 sm:p-8">
      <div className="flex flex-col gap-4 mx-auto">
        <EventsList events={foundEvents} />
      </div>
    </div>
  );
};

const EventsList: FC<{
  events: Awaited<ReturnType<typeof getPublicEvents>>;
}> = (props) => {
  return (
    <>
      {props.events.map((e) => (
        <Link
          key={e.id}
          href={`/events/${e.slug}`}
          className="grid grid-cols-2 gap-2"
        >
          <div className="relative h-48 w-48 rounded-lg overflow-hidden">
            <Image
              src={e.eventMedia[0].url ?? ""}
              alt=""
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-bold text-xl">{e.name}</h2>
            <p>s</p>
            <p>{e.description}</p>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Page;
