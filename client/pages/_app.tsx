import "@conorroberts/beluga/dist/styles.css";
import "../styles/globals.css";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import amplifyConfig from "~/config/amplify";
import { Router, useRouter } from "next/router";
import NavigationDrawer from "~/components/NavigationDrawer";
import TopNavigation from "~/components/TopNavigation";
import BottomNavigation from "~/components/BottomNavigation";
import { Authenticator } from "@aws-amplify/ui-react";
import LoadingScreen from "~/components/LoadingScreen";

Amplify.configure(amplifyConfig);

const App = ({ Component, pageProps }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      setLoading(true);
    });
    Router.events.on("routeChangeComplete", () => {
      setLoading(false);
    });

    const interval = setInterval(async () => {
      await Auth.currentSession();
    }, 1 * 1000 * 5);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [router.pathname]);

  return (
    <Authenticator.Provider>
      <div className="flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white min-h-screen md:pt-16 pb-24 md:pb-2 relative px-2 pt-2">
        <TopNavigation setDrawerOpen={setDrawerOpen} />
        {loading ? <LoadingScreen /> : <Component {...pageProps} />}
        {drawerOpen && <NavigationDrawer setOpen={setDrawerOpen} open={drawerOpen} />}
        <BottomNavigation setDrawerOpen={setDrawerOpen} />
      </div>
    </Authenticator.Provider>
  );
};

export default App;
