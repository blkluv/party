import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import EventForm from "~/components/EventForm";
import LoadingScreen from "~/components/LoadingScreen";
import MetaData from "~/components/MetaData";
import getEvent from "~/utils/getEvent";
import getEventNotifications from "~/utils/getEventNotifications";
import getToken from "~/utils/getToken";
import isUserAdmin from "~/utils/isUserAdmin";

const Page = () => {
  const { user } = useAuthenticator();
  const [eventData, setEventData] = useState(null);
  const [notificationData, setNotificationData] = useState([]);
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
        const event = await getEvent(router.query.eventId as string);
        setEventData(event);
        const notifications = await getEventNotifications(router.query.eventId as string, getToken(user));
        setNotificationData(notifications);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, router]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex flex-col mx-auto max-w-6xl w-full md:flex-row">
      <MetaData title="Edit Event" />
      <EventForm initialValues={{ event: eventData, notifications: notificationData }} />
    </div>
  );
};

export default Page;
