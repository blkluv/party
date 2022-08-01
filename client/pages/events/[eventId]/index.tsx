/* eslint-disable @next/next/no-img-element */
import { useAuthenticator } from "@aws-amplify/ui-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "~/components/form";
import { LeftCaretIcon, LoadingIcon, PencilIcon, RightCaretIcon, TrashIcon } from "~/components/Icons";
import MetaData from "~/components/MetaData";
import PartyBoxEvent from "~/types/PartyBoxEvent";
import deleteEvent from "~/utils/deleteEvent";
import getToken from "~/utils/getToken";
import isUserAdmin from "~/utils/isUserAdmin";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import getEvent from "~/utils/getEvent";
import LoadingScreen from "~/components/LoadingScreen";

const Page = () => {
  const { user } = useAuthenticator();
  const router = useRouter();

  const [loading, setLoading] = useState({ delete: false, event: true });
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [countdown, setCountDown] = useState("");
  const [eventData, setEventData] = useState<PartyBoxEvent | null>(null);

  const admin = isUserAdmin(user);
  const showLeftMediaButton = currentMediaIndex > 0;
  const showRightMediaButton = currentMediaIndex < eventData?.media?.length - 1;

  const handleDelete = async () => {
    setLoading((prev) => ({ ...prev, delete: true }));
    await deleteEvent(eventData.id, getToken(user));
    setLoading((prev) => ({ ...prev, delete: false }));

    await router.push("/");
  };

  useEffect(() => {
    if (!eventData) return;

    const interval = setInterval(() => {
      dayjs.extend(relativeTime);
      setCountDown(dayjs(new Date(eventData.startTime).toISOString()).fromNow());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [eventData]);

  // Fetch data on page load
  useEffect(() => {
    (async () => {
      if (!router.query.eventId) return;
      
      try {
        const event = await getEvent(router.query.eventId as string);
        setEventData(event);

        if (!event) throw new Error("Event not found");
      } catch (error) {
        console.error(error);
        await router.push("/");
      } finally {
        setLoading((prev) => ({ ...prev, event: false }));
      }
    })();
  }, [router]);

  if (loading.event || !eventData) return <LoadingScreen />;

  return (
    <div className="flex flex-col mx-auto max-w-6xl w-full md:flex-row">
      <MetaData title={`${eventData.name}`} />
      <div className="relative overflow-hidden rounded-md mx-auto md:flex-1">
        {showLeftMediaButton && (
          <div
            className="absolute top-1/2 left-6 -translate-x-1/2 rounded-full p-1 bg-opacity-50 backdrop-filter backdrop-blur-sm bg-gray-900 hover:bg-gray-800 cursor-pointer transition flex items-center justify-center"
            onClick={() => setCurrentMediaIndex((curr) => curr - 1)}
          >
            <LeftCaretIcon size={20} />
          </div>
        )}
        {eventData?.media[currentMediaIndex] && (
          <img src={eventData.media[currentMediaIndex]} alt="Poster" loading="eager" />
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
      <div className="p-3 flex flex-col gap-6 md:flex-1">
        {admin && (
          <div className="flex gap-4 justify-center">
            <div className="border border-gray-700 p-2 rounded-md flex justify-center max-w-max items-center cursor-pointer hover:bg-primary dark:hover:bg-primary transition gap-2">
              <TrashIcon onClick={handleDelete} />
              {loading.delete && <LoadingIcon className="animate-spin" size={20} />}
            </div>
            <div
              className="border border-gray-700 p-2 rounded-md flex justify-center max-w-max items-center cursor-pointer hover:bg-primary dark:hover:bg-primary transition gap-2"
              onClick={() => eventData.id && router.push(`/events/${eventData.id}/edit`)}
            >
              <PencilIcon />
            </div>
          </div>
        )}
        <div>
          <h2 className="font-bold text-3xl md:text-4xl text-center">{eventData.name}</h2>
          <p className="text-sm text-center mt-1 md:text-base">
            {new Date(eventData.startTime).toDateString()} at {new Date(eventData.startTime).toLocaleTimeString()} -{" "}
            {countdown}
          </p>
        </div>
        <p className="text-sm md:text-base">{eventData.description}</p>

        <h2 className="text-center text-lg font-semibold">Tickets</h2>
        <div className="flex justify-center">
          {eventData.prices.map((price) => (
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

export default Page;
