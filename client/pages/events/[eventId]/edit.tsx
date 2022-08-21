import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import EventForm from "~/components/EventForm";
import LoadingScreen from "~/components/LoadingScreen";
import MetaData from "~/components/MetaData";
import getFullEvent from "~/utils/getFullEvent";
import getToken from "~/utils/getToken";
import isUserAdmin from "~/utils/isUserAdmin";

const Page = () => {
  const { user } = useAuthenticator();
  const router = useRouter();

  const { data: eventData, isLoading: loading } = useQuery(
    "getFullEventData",
    async () => {
      // If we're still waiting on user data or event id, don't do anything
      if (!user || !router.query.eventId) return;

      if (!isUserAdmin(user)) {
        await router.push("/");
        return;
      }

      // We are an admin, so fetch the event data
      const event = await getFullEvent(router.query.eventId as string, getToken(user));
      return event;
    },
    {
      enabled: Boolean(user && router.query.eventId),
    }
  );

  if (loading) return <LoadingScreen />;

  return (
    <div className="mx-auto max-w-3xl w-full p-2">
      <MetaData title="Edit Event" />
      <EventForm initialValues={eventData} />
    </div>
  );
};

export default Page;
