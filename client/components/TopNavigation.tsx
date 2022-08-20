import Image from "next/image";
import Link from "next/link";
import { Menu } from "./Icons";

interface Props {
  setDrawerOpen: (open: boolean) => void;
}

const TopNavigation = ({ setDrawerOpen }: Props) => {
  return (
    <div className="hidden md:flex z-50 justify-start px-6 gap-6 items-center fixed top-0 left-0 right-0 h-16 bg-gray-100 bg-opacity-90 backdrop-filter backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-90 rounded-xl">
      <div className="cursor-pointer primary-hover" onClick={() => setDrawerOpen(true)}>
        <Menu size={20} />
      </div>
      <Link passHref href="/">
        <a className="cursor-pointer flex gap-4 items-center">
          <Image src="/images/Logo.svg" width={22} height={22} alt="Logo" priority loading="eager" />
          <p className="font-bold text-lg">Party Box</p>
        </a>
      </Link>
    </div>
  );
};

export default TopNavigation;
