import { PartyBoxService } from "@party-box/common";
import { FC } from "react";
import { CheckIcon } from "./Icons";

interface Props {
  service: PartyBoxService;
  selected: boolean;
  onClick: () => void;
}

const FormServicePreview: FC<Props> = ({ service: { name, price, description }, selected, onClick }) => {
  return (
    <div
      className="border border-gray-700 rounded-xl p-2 cursor-pointer hover:scale-[99%] transition"
      onClick={() => onClick()}
    >
      <div className="flex gap-4 items-center">
        <div className="rounded-full w-24 h-24 bg-gray-500"></div>
        <div>
          <h4 className="font-bold text-lg capitalize">{name}</h4>
          <p className="text-sm text-gray-400">Price ${price}</p>
        </div>

        {selected && <CheckIcon size={30} className="text-emerald-500 ml-auto" />}
      </div>
      <p>{description}</p>
    </div>
  );
};

export default FormServicePreview;
