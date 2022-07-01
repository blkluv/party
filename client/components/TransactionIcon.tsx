import { FoodIcon } from "./Icons";

interface Props {
  category: string;
}

const style = "rounded-full p-3";
const size = 25;

const TransactionIcon = ({ category }: Props) => {
  switch (category) {
    case "food":
      return (
        <div className={`${style} bg-emerald-500`}>
          <FoodIcon size={size} />
        </div>
      );
    default:
      return null;
  }
};

export default TransactionIcon;
