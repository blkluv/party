import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { API_URL } from "~/config/config";

const Page = () => {
  const { query } = useRouter();
  console.log(query);
  return (
    <div>
      <h1>Page</h1>
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const { ticketId } = context.query;
  const response = await fetch(`${API_URL}/tickets/${ticketId}`);
  const data = await response.json();

  console.log(data);
  return {
    props: {},
  };
};

export default Page;
