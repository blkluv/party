import Transaction from "~/components/Transaction";
import TransactionData from "~/types/TransactionData";

const transactions: TransactionData[] = [
  {
    id: "1",
    value: 100,
    timestamp: "2020-01-01",
    groupId: "11",
    owner: {
      name: "John Doe",
      id: "55",
    },
    description: "Lunch",
    category: "food",
  },
];

const TransactionList = () => {
  return (
    <div>
      {transactions.map((e) => (
        <Transaction key={e.id} {...e} />
      ))}
    </div>
  );
};

export default TransactionList;
