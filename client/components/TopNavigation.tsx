import { Menu } from "./Icons";
import TopNavigationLink from "./TopNavigationLink";

interface Props {
  setDrawerOpen: (open: boolean) => void;
}

const TopNavigation = ({ setDrawerOpen }: Props) => {
  return (
    <div className="hidden md:flex z-30 justify-start px-6 gap-6 items-center fixed top-0 left-0 right-0 py-6 bg-gray-100 bg-opacity-90 backdrop-filter backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-90 rounded-xl">
      <div className="cursor-pointer primary-hover" onClick={() => setDrawerOpen(true)}>
        <Menu size={20} />
      </div>
      <TopNavigationLink href="/" text="Home" />
    </div>
  );
};

export default TopNavigation;
