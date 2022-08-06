import EventForm from "~/components/EventForm";
import MetaData from "~/components/MetaData";

const Page = () => {
  return (
    <div className="mx-auto max-w-3xl w-full p-2">
      <MetaData title="Create Event" />
      <h1 className="text-center text-3xl font-bold mb-4">Create Event</h1>
      <EventForm />
    </div>
  );
};

export default Page;
