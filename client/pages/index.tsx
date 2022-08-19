import Image from "next/image";
import MetaData from "~/components/MetaData";
import Testimonial from "~/components/Testimonial";
import UpcomingEvents from "~/components/UpcomingEvents";

const Page = () => {
  return (
    <div className="mx-auto max-w-5xl w-full flex flex-col gap-8 sm:gap-16">
      <MetaData title="Home" />
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
