import { PartyBoxHost } from "@party-box/common";
import { NextPageContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import MetaData from "~/components/MetaData";
import { API_URL } from "~/config/config";

interface Props {
  host: PartyBoxHost;
}

const Page: FC<Props> = ({ host }) => {
  return (
    <div className="flex md:gap-16 gap-8 flex-col md:flex-row mx-auto max-w-6xl w-full">
      <MetaData title={host.name} description={host.description} />
      <div className="flex gap-4 flex-col md:w-1/3">
        <div className="relative max-w-full h-96 rounded-xl shadow-md overflow-hidden">
          <Image src={host.imageUrl} layout="fill" objectFit="cover" alt="Host profile picture" />
        </div>

        <h1 className="font-bold text-2xl">{host.name}</h1>
        <p>{host.description}</p>
      </div>
      <div className="md:w-2/3">
        <h3 className="font-bold text-lg">Events</h3>
        <div className="flex flex-col divide-y divide-gray-800">
          {host.events.map((e) => (
            <Link key={`event ${e.id}`} passHref href={`/events/${e.id}`}>
              <a className="flex gap-2 py-2 hover:bg-gray-800 cursor-pointer transition">
                <Image
                  height={75}
                  width={75}
                  objectFit="cover"
                  alt={`host ${e.id}`}
                  src={e.thumbnail}
                  className="rounded"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{e.name}</h4>
                  <p className="text-sm text-gray-400">{e.description}</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
        {host.events.length === 0 && <p className="text-center text-sm text-gray-300">No events</p>}
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const hostId = context.query.hostId;

  const host = await fetch(`${API_URL}/hosts/${hostId}`).then((res) => res.json());

  return {
    props: {
      host,
    },
  };
};

export default Page;
