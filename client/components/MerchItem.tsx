import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { FC, useState } from "react";
import { LeftCaretIcon, RightCaretIcon } from "./Icons";

interface Props {
  name: string;
  price: number;
  images: string[];
}

const MerchItem: FC<Props> = ({ name, images }) => {
  const [index, setIndex] = useState(0);

  const showLeftMediaButton = index > 0;
  const showRightMediaButton = index < images.length - 1;

  return (
    <div className="rounded-lg border border-gray-800 shadow-md w-[175px] md:w-[250px] overflow-hidden">
      <div className="relative">
        {showLeftMediaButton && (
          <div
            className="absolute top-1/2 left-6 -translate-x-1/2 rounded-full p-1 bg-opacity-50 backdrop-filter backdrop-blur-sm bg-gray-900 hover:bg-gray-800 cursor-pointer transition flex items-center justify-center z-10"
            onClick={() => setIndex((curr) => (curr - 1 < 0 ? 0 : curr - 1))}
          >
            <LeftCaretIcon size={20} />
          </div>
        )}
        <AnimatePresence initial={false}>
          <motion.div className="relative min-w-[150px] md:min-w-[250px] h-64 overflow-hidden">
            <Image src={images[index]} layout="fill" objectFit="cover" alt="Some merch picture" />
          </motion.div>
        </AnimatePresence>
        {showRightMediaButton && (
          <div
            className="absolute top-1/2 right-6 translate-x-1/2 rounded-full p-1 bg-opacity-50 backdrop-filter backdrop-blur-sm bg-gray-900 hover:bg-gray-800 cursor-pointer transition flex items-center justify-center z-10"
            onClick={() => setIndex((curr) => (curr + 1 > images.length - 1 ? curr : curr + 1))}
          >
            <RightCaretIcon size={20} />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="capitalize font-medium text-sm">{name}</p>
      </div>
    </div>
  );
};

export default MerchItem;
