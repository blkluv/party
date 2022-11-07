import Image from "next/image";
import Link from "next/link";
import MetaData from "~/components/MetaData";
import Testimonial from "~/components/Testimonial";
import UpcomingEvents from "~/components/UpcomingEvents";

const Page = () => {
  return (
    <div className="mx-auto max-w-5xl w-full flex flex-col gap-8 sm:gap-16">
      <MetaData title="Home" />
      <div className="mx-auto flex justify-center items-center flex-col">
        {/* <h1 className="font-bold text-5xl sm:text-7xl logo-gradient py-2">Party Box</h1> */}
        <div className="relative w-[calc(250px*1.3)] h-[calc(75px*1.3)] sm:w-[calc(250px*2.5)] sm:h-[calc(75px*2.5)] md:w-[calc(250px*3)] md:h-[calc(75px*3)]">
          <Image src="/images/text-logo.svg" alt="Logo" layout="fill" objectFit="contain" priority loading="eager" />
        </div>
        <Link href="/store">
          <a className="bg-gray-800 rounded-full py-1 px-7 text-sm text-center primary-hover">Check out our merch!</a>
        </Link>
      </div>

      <UpcomingEvents />

      <div>
        <h2 className="font-bold text-xl mb-6 text-center">Testimonials</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <Testimonial
            imageUrl="/images/testimony_2.png"
            name="Chloe, Grad, UofG"
            description={`"I needed rent so I Party Boxed my house for an Hawaiian themed party. Great Vibes 10/10 for sure would recommend."`}
          />
          <Testimonial
            imageUrl="/images/testimony_3.png"
            name="Duncan, 4th Year, UofG"
            description={`"Hosted a toga party with Party Box last year. Had a great time , made some cash and still had a functioning toilet after all of it. Looking forward to hosting more next semester."`}
          />
          <Testimonial
            imageUrl="/images/testimony_4.jpg"
            name="Matt, 3rd Year, UofG"
            description={`"Shoutout to Party Box and Spidr for my Halloween party. I'll always be able to host big bangers that attract hundreds."`}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
