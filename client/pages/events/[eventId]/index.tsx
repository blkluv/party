/* eslint-disable @next/next/no-img-element */
import { useAuthenticator } from "@aws-amplify/ui-react";
import { FC, useEffect, useState } from "react";
import { LeftCaretIcon, RightCaretIcon } from "~/components/Icons";
import MetaData from "~/components/MetaData";
import { PartyBoxEvent } from "@party-box/common";
import isUserAdmin from "~/utils/isUserAdmin";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import EventPrice from "~/components/EventPrice";
import { NextPageContext } from "next";
import { API_URL } from "~/config/config";
import EventAdminToolbar from "~/components/EventAdminToolbar";
dayjs.extend(relativeTime);

interface Props {
  eventData: PartyBoxEvent;
}

const Page: FC<Props> = ({ eventData }) => {
  const { user } = useAuthenticator();

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [countdown, setCountDown] = useState("");

  const admin = isUserAdmin(user);
  const showLeftMediaButton = currentMediaIndex > 0;
  const showRightMediaButton = currentMediaIndex < eventData?.media?.length - 1;

  useEffect(() => {
    if (!eventData) return;

    setCountDown(dayjs(new Date(eventData.startTime).toISOString()).fromNow());

    const interval = setInterval(() => {
      setCountDown(dayjs(new Date(eventData.startTime).toISOString()).fromNow());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [eventData]);

  return (
    <div className="flex flex-col mx-auto max-w-6xl w-full md:flex-row">
      <MetaData title={`${eventData.name}`} />
      <div className="relative overflow-hidden rounded-md mx-auto md:flex-1 md:w-auto w-full">
        {showLeftMediaButton && (
          <div
            className="absolute top-1/2 left-6 -translate-x-1/2 rounded-full p-1 bg-opacity-50 backdrop-filter backdrop-blur-sm bg-gray-900 hover:bg-gray-800 cursor-pointer transition flex items-center justify-center"
            onClick={() => setCurrentMediaIndex((curr) => curr - 1)}
          >
            <LeftCaretIcon size={20} />
          </div>
        )}
        {eventData?.media[currentMediaIndex] && (
          <img src={eventData.media[currentMediaIndex]} alt="Poster" loading="eager" className="w-full max-h-screen" />
        )}
        {showRightMediaButton && (
          <div
            className="absolute top-1/2 right-6 translate-x-1/2 rounded-full p-1 bg-opacity-50 backdrop-filter backdrop-blur-sm bg-gray-900 hover:bg-gray-800 cursor-pointer transition flex items-center justify-center"
            onClick={() => setCurrentMediaIndex((curr) => curr + 1)}
          >
            <RightCaretIcon size={20} />
          </div>
        )}
      </div>
      <div className="p-3 md:p-6 flex flex-col gap-6 md:flex-1">
        {admin && <EventAdminToolbar eventId={eventData.id} />}
        <div>
          <h2 className="font-bold text-3xl md:text-4xl text-center">{eventData.name}</h2>
          <p className="text-sm text-center mt-1 md:text-base">
            {new Date(eventData.startTime).toDateString()} at {new Date(eventData.startTime).toLocaleTimeString()} -
            {countdown}
          </p>
        </div>
        <p className="text-sm md:text-base">{eventData.description}</p>

        <h2 className="text-center text-lg font-semibold">Tickets</h2>
        <div className="flex justify-center">
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
