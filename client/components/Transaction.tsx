import Transaction from "~/types/TransactionData";
import TransactionIcon from "./TransactionIcon";

const Transaction = ({ value, category }: Transaction) => {
  return (
    <div className="flex gap-4">
      <TransactionIcon category={category} />
      <p>{value}</p>
    </div>
  );
};

export default Transaction;
