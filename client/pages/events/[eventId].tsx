import { NextPageContext } from "next";
import { API_URL } from "~/config/config";
import PartyBoxEvent from "~/types/PartyBoxEvent";

interface Props {
  event: PartyBoxEvent;
}

const Page = ({ event }: Props) => {
  console.log(event);
  return (
    <div>
      <h1>Page</h1>
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
