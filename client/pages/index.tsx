import MetaData from "~/components/MetaData";
import UpcomingEvents from "~/components/UpcomingEvents";

const Page = () => {
  return (
    <div className="mx-auto max-w-2xl w-full">
      <h1 className="rainbow-text text-6xl font-bold text-center my-4">Party Box</h1>
      <MetaData title="Home" />
      <UpcomingEvents />
    </div>
  );
};

export default Page;
