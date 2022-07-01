import User from "./User";

interface TransactionData {
  id: string;
  groupId: string;
  value: number;
  timestamp: string;
  owner: User;
  description: string;
  category: string;
}

export default TransactionData;
