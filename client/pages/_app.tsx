import "@conorroberts/beluga/dist/preflight.css";
import "@conorroberts/beluga/dist/styles.css";
import "../styles/preflight.css";
import "../styles/globals.css";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import amplifyConfig from "~/config/amplify";
import { Router } from "next/router";
import NavigationDrawer from "~/components/NavigationDrawer";
import TopNavigation from "~/components/TopNavigation";
import BottomNavigation from "~/components/BottomNavigation";
import { Authenticator } from "@aws-amplify/ui-react";
import LoadingScreen from "~/components/LoadingScreen";
import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";
import queryClientConfig from "~/config/queryClientConfig";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(localeData);

// Attach the user's access token (JWT) to axios headers if a user is present
axios.interceptors.request.use(
  async (config) => {
    try {
      const user = await Auth.currentSession();

      config.headers.Authorization = `Bearer ${user.getAccessToken().getJwtToken()}`;

      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

Amplify.configure(amplifyConfig);
const queryClient = new QueryClient(queryClientConfig);

const App = ({ Component, pageProps }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // This is used to display a loading screen in transition
    // Helps for when we're fetching data from the server so the user has feedback in the meantime
    Router.events.on("routeChangeStart", () => {
      setDrawerOpen(false);
      setLoading(true);
    });
    Router.events.on("routeChangeComplete", () => {
      setLoading(false);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Authenticator.Provider>
        <div className="flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white min-h-screen md:pt-[70px] pb-24 md:pb-2 relative px-2 pt-2">
          <TopNavigation setDrawerOpen={setDrawerOpen} />
          {loading ? <LoadingScreen /> : <Component {...pageProps} />}
          {drawerOpen && <NavigationDrawer setOpen={setDrawerOpen} open={drawerOpen} />}
          <BottomNavigation setDrawerOpen={setDrawerOpen} />
        </div>
      </Authenticator.Provider>
    </QueryClientProvider>
  );
};

export default App;
