import { CheckIcon } from "~/components/Icons";
import MetaData from "~/components/MetaData";

const Page = () => {
  return (
    <div className="flex justify-center items-center flex-1">
      <MetaData title="Purchase Successful" />
      <div className="bg-gray-800 shadow-md rounded-lg flex flex-col w-full max-w-md items-center p-6 text-center">
        <CheckIcon size={85} className="mb-8 text-emerald-600 bg-white rounded-full" />
        <h1 className="font-bold text-3xl">Purchase Successful</h1>
        <p>You should receive an SMS order confirmation shortly.</p>
      </div>
    </div>
  );
};

export default Page;
