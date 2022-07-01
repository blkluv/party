import MetaData from "~/components/MetaData";
import TransactionList from "~/components/TransactionList";

const Page = () => {
  return (
    <div>
      <MetaData title="Home" />
      <h1>Page</h1>
      <TransactionList />
    </div>
  );
};

export default Page;
