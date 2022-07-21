/* eslint-disable @next/next/no-img-element */
import { useAuthenticator } from "@aws-amplify/ui-react";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "~/components/form";
import { LeftCaretIcon, RightCaretIcon, TrashIcon } from "~/components/Icons";
import MetaData from "~/components/MetaData";
import { API_URL } from "~/config/config";
import PartyBoxEvent from "~/types/PartyBoxEvent";
import deleteEvent from "~/utils/deleteEvent";
import getToken from "~/utils/getToken";
import isUserAdmin from "~/utils/isUserAdmin";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

interface Props {
  event: PartyBoxEvent;
}

const Page = ({ event }: Props) => {
  const { user } = useAuthenticator();
  const router = useRouter();

  const [loading, setLoading] = useState({ delete: false });
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [countdown, setCountDown] = useState("");

  const admin = isUserAdmin(user);
  const showLeftMediaButton = currentMediaIndex > 0;
  const showRightMediaButton = currentMediaIndex < event.media.length - 1;

  const handleDelete = async () => {
    setLoading((prev) => ({ ...prev, delete: true }));
    await deleteEvent(event.id, getToken(user));
    setLoading((prev) => ({ ...prev, delete: false }));

    await router.push("/");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dayjs.extend(relativeTime);
      setCountDown(dayjs(new Date(event.startTime).toISOString()).fromNow());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [event]);

  return (
    <div className="flex flex-col mx-auto max-w-6xl w-full md:flex-row">
      <MetaData title={`${event.name}`} />
      <div className="relative overflow-hidden rounded-md mx-auto md:flex-1">
        {showLeftMediaButton && (
          <div
            className="absolute top-1/2 left-6 -translate-x-1/2 rounded-full p-1 bg-opacity-50 backdrop-filter backdrop-blur-sm bg-gray-900 hover:bg-gray-800 cursor-pointer transition flex items-center justify-center"
            onClick={() => setCurrentMediaIndex((curr) => curr - 1)}
          >
            <LeftCaretIcon size={20} />
          </div>
        )}
        {event.media[currentMediaIndex] && <img src={event.media[currentMediaIndex]} alt="Poster" loading="eager" />}
        {showRightMediaButton && (
          <div
            className="absolute top-1/2 right-6 translate-x-1/2 rounded-full p-1 bg-opacity-50 backdrop-filter backdrop-blur-sm bg-gray-900 hover:bg-gray-800 cursor-pointer transition flex items-center justify-center"
            onClick={() => setCurrentMediaIndex((curr) => curr + 1)}
          >
            <RightCaretIcon size={20} />
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-6 md:flex-1">
        {admin && (
          <div className="border border-gray-700 p-2 rounded-md flex justify-center max-w-max mx-auto">
            <TrashIcon onClick={handleDelete} />
          </div>
        )}
        <div>
          <h2 className="font-bold text-3xl md:text-4xl text-center">{event.name}</h2>
          <p className="text-sm text-center mt-1 md:text-base">
            {new Date(event.startTime).toDateString()} at {new Date(event.startTime).toLocaleTimeString()} - {countdown}
          </p>
        </div>
        <p className="text-sm md:text-base">{event.description}</p>

        <h2 className="text-center text-lg font-semibold">Tickets</h2>
        <div className="flex justify-center">
          {event.prices.map((price) => (
            <div
              key={price.id}
              className="flex gap-4 mx-auto max-w-lg w-full rounded-md bg-gray-800 p-3 shadow-md items-center"
            >
              <h3 className="font-medium">{price.name}</h3>
              <p>${price.price.toFixed(2)}</p>
              <div className="ml-auto">
                <Link href={price.paymentLink} passHref>
                  <a>
                    <Button>Get Tickets</Button>
                  </a>
                </Link>
              </div>
            </div>
          ))}
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
