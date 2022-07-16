import Image from "next/image";
import { CloseIcon, LeftCaretIcon, RightCaretIcon } from "./Icons";

interface Props {
  removeImage: () => void;
  image: string;
  name: string;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  position?: number;
}

const FormPreviewImage = ({ removeImage, image, name, position, onMoveLeft, onMoveRight }: Props) => {
  return (
    <div className="relative h-64">
      <div
        className="bg-gray-900 rounded-full p-0.5 flex justify-center items-center absolute top-0 right-0 z-10 transform -translate-y-1/2 translate-x-1/2 border border-gray-700 shadow-md hover:bg-gray-700 transition cursor-pointer"
        onClick={() => removeImage()}
      >
        <CloseIcon />
      </div>
      {onMoveLeft && onMoveRight && (
        <div className="bg-gray-900 rounded-full p-0.5 flex justify-center items-center absolute top-0 left-1/2 z-10 transform -translate-y-1/2 -translate-x-1/2 border border-gray-700 shadow-md divide-x divide-gray-600">
          <LeftCaretIcon className="hover:text-gray-200 transition cursor-pointer" onClick={() => onMoveLeft()} />
          <RightCaretIcon className="hover:text-gray-200 transition cursor-pointer" onClick={() => onMoveRight()} />
        </div>
      )}
      <Image src={image} layout="fill" objectFit="cover" alt={name} />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transform bg-gray-900 backdrop-filter backdrop-blur-sm backdrop-opacity-25 px-1.5 py-1 rounded-md overflow-hidden w-max divide-x divide-gray-600 flex items-center max-w-[75%]">
        {position !== undefined && <p className="text-xs pr-2">{position}</p>}
        <p className="text-xs text-center pl-2 text-ellipsis">{name}</p>
      </div>
    </div>
  );
};

export default FormPreviewImage;
