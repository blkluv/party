import Image from "next/image";
import MetaData from "~/components/MetaData";
import Testimonial from "~/components/Testimonial";
import UpcomingEvents from "~/components/UpcomingEvents";

const Page = () => {
  return (
    <div className="mx-auto max-w-5xl w-full flex flex-col gap-8 sm:gap-16">
      <MetaData title="Home" />
      <div className="mx-auto flex gap-8 items-center">
        {/* <h1 className="font-bold text-5xl sm:text-7xl logo-gradient py-2">Party Box</h1> */}
        <div className="relative w-[300px] h-[150px] sm:w-[500px] sm:h-[200px]">
          <Image src="/images/Logo.png" alt="Logo" layout="fill" objectFit="contain" priority loading="eager" />
        </div>
      </div>

      <UpcomingEvents />

      <div>
        <h2 className="font-bold text-xl mb-6 text-center">Testimonials</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <Testimonial
            imageUrl="/images/testimony_1.jpg"
            name="David, 3rd Year, UofG"
            description={`"I used Party Box to host my best friends party last sem. Got a DJ, Speakers, Party Lights they even blessed a photographer. Would definitely recommend it if you're looking to party and make money at the same time."`}
          />
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
        </div>
      </div>
    </div>
  );
};

export default Page;
