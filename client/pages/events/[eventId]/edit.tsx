import { useAuthenticator } from "@aws-amplify/ui-react";
import { PartyBoxEvent } from "@party-box/common";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import EventForm from "~/components/EventForm";
import LoadingScreen from "~/components/LoadingScreen";
import MetaData from "~/components/MetaData";
import getFullEvent from "~/utils/getFullEvent";
import getToken from "~/utils/getToken";
import isUserAdmin from "~/utils/isUserAdmin";

const Page = () => {
  const { user } = useAuthenticator();
  const [eventData, setEventData] = useState<PartyBoxEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // If we're still waiting on user data or event id, don't do anything
      if (!user || !router.query.eventId) return;

      if (!isUserAdmin(user)) {
        await router.push("/");
        return;
      }

      // We are an admin, so fetch the event data
      try {
        const event = await getFullEvent(router.query.eventId as string, getToken(user));
        setEventData(event);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, router]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="mx-auto max-w-3xl w-full p-2">
      <MetaData title="Edit Event" />
      <EventForm initialValues={eventData} />
    </div>
  );
};

export default Page;
