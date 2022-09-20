import { useAuthenticator } from "@aws-amplify/ui-react";
import MetaData from "~/components/MetaData";
import { CompleteEvent } from "@party-box/common";
import isUserAdmin from "~/utils/isUserAdmin";
import dayjs from "dayjs";
import EventPrice from "~/components/EventPrice";
import { NextPage, NextPageContext } from "next";
import { API_URL } from "~/config/config";
import EventAdminToolbar from "~/components/EventAdminToolbar";
import MediaCarousel from "~/components/MediaCarousel";

interface Props {
  eventData: CompleteEvent;
}

const Page: NextPage<Props> = ({ eventData }) => {
  const { user } = useAuthenticator();

  const admin = isUserAdmin(user);

  return (
    <div className="flex flex-col mx-auto max-w-6xl w-full md:flex-row flex-1">
      <MetaData title={`${eventData.name}`} description={eventData.description} image={eventData.thumbnail} />
      <MediaCarousel media={eventData.media} />
      <div className="p-3 md:p-6 flex flex-col gap-6 md:flex-1">
        {admin && <EventAdminToolbar eventId={eventData.id} />}
        <div>
          <h2 className="font-bold text-3xl md:text-4xl text-center">{eventData.name}</h2>
          <p className="text-sm text-center mt-1 md:text-base">
            {dayjs(eventData.startTime).format("dddd MMMM D [at] h:mm A")}
          </p>
        </div>
        <p className="text-sm md:text-base">{eventData.description}</p>

        <h2 className="text-center text-lg font-semibold">Tickets</h2>
        <div className="flex justify-center flex-col gap-4">
          {eventData.prices.map((price) => (
            <EventPrice key={price.id} {...price} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const eventId = context.query.eventId;
  const data = await fetch(`${API_URL}/events/${eventId}`);

  if (!data.ok) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const event = await data.json();

  return {
    props: {
      eventData: event,
    },
  };
};

export default Page;

