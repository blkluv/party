import Image from "next/image";
import MetaData from "~/components/MetaData";
import UpcomingEvents from "~/components/UpcomingEvents";

const Page = () => {
  return (
    <div className="mx-auto max-w-4xl w-full">
      <div className="w-full h-72 relative mx-auto">
        <Image
          src="/images/Party_Box.svg"
          layout="fill"
          objectFit="cover"
          alt="Orange text reading Party Box"
          priority
          loading="eager"
        />
      </div>
      <MetaData title="Home" />
      <UpcomingEvents />
    </div>
  );
};

export default Page;
