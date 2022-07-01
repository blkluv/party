import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import BottomNavigation from "~/components/BottomNavigation";
import NavigationDrawer from "~/components/NavigationDrawer";
import TopNavigation from "~/components/TopNavigation";

interface Props {
  children: ReactNode;
}

const Default = ({ children }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setDrawerOpen(false);
  }, [router.pathname]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white min-h-screen md:pt-24 pb-24 md:pb-0 relative">
      <TopNavigation setDrawerOpen={setDrawerOpen} />
      {children}
      {drawerOpen && <NavigationDrawer setOpen={setDrawerOpen} />}
      <BottomNavigation setDrawerOpen={setDrawerOpen} />
    </div>
  );
};

export default Default;
