/* eslint-disable @next/next/no-img-element */
import { FC, useState } from "react";
import { LeftCaretIcon, RightCaretIcon } from "./Icons";

interface Props {
  media: string[];
}

const MediaCarousel: FC<Props> = ({ media = [] }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const showLeftMediaButton = currentMediaIndex > 0;
  const showRightMediaButton = currentMediaIndex < media.length - 1;

  return (
    <div className="relative overflow-hidden rounded-md mx-auto md:flex-1 w-full">
      {showLeftMediaButton && (
        <div
          className="absolute top-1/2 left-6 -translate-x-1/2 rounded-full p-1 bg-opacity-50 backdrop-filter backdrop-blur-sm bg-gray-900 hover:bg-gray-800 cursor-pointer transition flex items-center justify-center"
          onClick={() => setCurrentMediaIndex((curr) => curr - 1)}
        >
          <LeftCaretIcon size={20} />
        </div>
      )}
      {media[currentMediaIndex] && <img src={media[currentMediaIndex]} alt="Poster" className="mx-auto max-h-[800px]" />}
      {showRightMediaButton && (
        <div
          className="absolute top-1/2 right-6 translate-x-1/2 rounded-full p-1 bg-opacity-50 backdrop-filter backdrop-blur-sm bg-gray-900 hover:bg-gray-800 cursor-pointer transition flex items-center justify-center"
          onClick={() => setCurrentMediaIndex((curr) => curr + 1)}
        >
          <RightCaretIcon size={20} />
        </div>
      )}
    </div>
  );
};

export default MediaCarousel;
