import "../styles/globals.css";
import { Amplify } from "aws-amplify";
import { useEffect, useState } from "react";
import amplifyConfig from "~/config/amplify";
import { APP_NAME } from "~/config/config";
import { useRouter } from "next/router";
import NavigationDrawer from "~/components/NavigationDrawer";
import TopNavigation from "~/components/TopNavigation";
import BottomNavigation from "~/components/BottomNavigation";

const App = ({ Component, pageProps }) => {
  useEffect(() => {
    Amplify.configure(amplifyConfig);
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setDrawerOpen(false);
  }, [router.pathname]);

  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white min-h-screen md:pt-24 pb-24 md:pb-2 relative px-2 pt-2">
      <TopNavigation setDrawerOpen={setDrawerOpen} />
      <Component {...pageProps} />
      {drawerOpen && <NavigationDrawer setOpen={setDrawerOpen} />}
      <BottomNavigation setDrawerOpen={setDrawerOpen} />
    </div>
  );
};

export default App;
