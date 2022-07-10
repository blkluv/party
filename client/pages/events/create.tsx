import EventForm from "~/components/EventForm";
import MetaData from "~/components/MetaData";

const Page = () => {
  return (
    <div className="mx-auto max-w-xl w-full">
      <MetaData title="Create Event" />
      <EventForm />
    </div>
  );
};

export default Page;
