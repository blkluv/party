import Image from "next/image";
import { FC } from "react";

interface TestmonialProps {
  name: string;
  description: string;
  imageUrl: string;
}

const Testimonial: FC<TestmonialProps> = ({ imageUrl, name, description }) => {
  return (
    <div className="flex flex-col w-72 md:w-auto md:flex-1 items-center rounded-lg overflow-hidden p-2">
      <div className="rounded-full p-1 bg-gradient">
        <div className="relative w-48 h-48 overflow-hidden rounded-full">
          <Image layout="fill" objectFit="cover" src={imageUrl} alt={`${name} party testimonial`} />
        </div>
      </div>
      <div className="py-4 px-4 flex-1">
        <h3 className="font-bold text-lg mb-2 text-center">{name}</h3>
        <p className="text-sm text-gray-200">{description}</p>
      </div>
    </div>
  );
};

export default Testimonial;
