import Image from "next/image";
import Link from "next/link";
import { Menu } from "./Icons";

interface Props {
  setDrawerOpen: (open: boolean) => void;
}

const TopNavigation = ({ setDrawerOpen }: Props) => {
  return (
    <div className="hidden md:flex z-50 justify-start px-6 gap-4 items-center fixed top-0 left-0 right-0 h-16 bg-gray-100 bg-opacity-90 backdrop-filter backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-90 border-b border-gray-800">
      <div className="cursor-pointer primary-hover" onClick={() => setDrawerOpen(true)}>
        <Menu size={20} />
      </div>
      <Link passHref href="/">
        <a className="cursor-pointer flex items-center relative w-[calc(250px/2)] h-[calc(75px/2)]">
          <Image src="/images/text-logo.svg" layout="fill" objectFit="contain" alt="Logo" priority loading="eager" />
        </a>
      </Link>
      <div className="flex gap-4 ml-auto">
        <Link passHref href="/hire-us">
          <a className="cursor-pointer primary-hover">Host a Party</a>
        </Link>
      </div>
    </div>
  );
};

export default TopNavigation;
