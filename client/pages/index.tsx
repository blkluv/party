import EventForm from "~/components/EventForm";
import MetaData from "~/components/MetaData";
import UpcomingEvents from "~/components/UpcomingEvents";

const Page = () => {
  return (
    <div>
      <MetaData title="Home" />
      <h1>Page</h1>
      <EventForm />
      <UpcomingEvents/>
    </div>
  );
};


export default Page;
