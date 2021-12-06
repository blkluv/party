import Navigation from '@components/Navigation'
import { APP_NAME } from '@config/config';
import { initializeApp } from '@firebase/app';
import { Provider } from 'context/Context';
import Head from 'next/head'
import "../styles/globals.css";
import firebaseConfig from "@config/firebase";

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

        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

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
      <Provider>
        <div className="bg-gray-100 dark:bg-black text-black dark:text-white min-h-screen bg-opacity-50 pb-24 md:pb-0 flex flex-col" id="app">
          <Navigation />
          <Component {...pageProps} />
        </div>
      </Provider>
    </>
  )
}
