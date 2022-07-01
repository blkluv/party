import "../styles/globals.css";
import { Amplify } from "aws-amplify";
import { useEffect } from "react";
import amplifyConfig from "~/config/amplify";
import Default from "~/layouts/Default";
import { APP_NAME } from "~/config/config";
import Head from "next/head";

const App = ({ Component, pageProps }) => {
  useEffect(() => {
    Amplify.configure(amplifyConfig);
  }, []);

  return (
    <Default>
      <Component {...pageProps} />
    </Default>
  );
};

export default App;
