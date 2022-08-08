import { PartyBoxHost } from "@party-box/common";
import { NextPageContext } from "next";
import { FC } from "react";

interface Props {
  host: PartyBoxHost;
}

const Page: FC<Props> = ({ host }) => {
  return (
    <div className="flex md:gap-16 gap-8 flex-col md:flex-row mx-auto max-w-6xl">
      <div className="flex gap-4 flex-col md:w-1/3">
        <img src={host.imageUrl} className="object-contain max-w-full h-auto rounded-xl shadow-md overflow-hidden" />
        <h1 className="font-bold text-2xl">{host.name}</h1>
        <p>{host.description}</p>
      </div>
      <div>
        {host.events.map((e) => (
          <p key={e.id}>{e.name}</p>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps = (context: NextPageContext) => {
  const hostId = context.query.hostId;

  const host: PartyBoxHost = {
    id: Number(hostId),
    name: "Some Frat House",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut neque vel leo dignissim hendrerit. Sed et enim arcu. Nunc id lacus odio. Pellentesque tincidunt diam a nulla semper, vitae facilisis eros pretium. Praesent in est leo. Sed lacinia ornare lorem, non iaculis lacus tincidunt eu. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse vulputate tempor lorem vitae congue.",
    events: [],
    createdBy: "someuseridhere",
    imageUrl: "https://placebear.com/g/800/800",
  };

  return {
    props: {
      host,
    },
  };
};

export default Page;