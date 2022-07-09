import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import MetaData from "~/components/MetaData";
import UpcomingEvents from "~/components/UpcomingEvents";
import getUserGroups from "~/utils/getUserGroups";

const Page = () => {
  const { user } = useAuthenticator();

  useEffect(() => {
    (() => {
      console.log(getUserGroups(user));
    })();
  }, [user]);

  return (
    <div className="mx-auto max-w-2xl w-full">
      <h1 className="rainbow-text text-6xl font-bold text-center my-4">Party Box</h1>
      <MetaData title="Home" />
      <UpcomingEvents />
    </div>
  );
};

export default Page;
