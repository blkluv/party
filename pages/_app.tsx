import Navigation from '@components/Navigation'
import { APP_NAME } from '@config/config';
import { initializeApp } from '@firebase/app';
import store from "@redux/store";
import StateManager from '@components/StateManager'
import Head from 'next/head'
import "../styles/globals.css";
import firebaseConfig from "@config/firebase";
import { Provider } from 'react-redux';

initializeApp(firebaseConfig);

export default function MyApp({ Component, pageProps }) {

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content={APP_NAME} />
        <meta name="keywords" content={APP_NAME} />
        <title>{APP_NAME}</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/icon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/icon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        {/* <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"></link> */}
        <meta name="theme-color" content="#dbdbdb" />
      </Head>
      <Provider store={store}>
        <div className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white min-h-screen md:pt-24 pb-24 md:pb-0 relative flex flex-col" id="app">
          <StateManager />
          <Navigation />
          <Component {...pageProps} />
        </div>
      </Provider>
    </>
  )
}
