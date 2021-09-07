import Navigation from '@components/Navigation'
import Head from 'next/head'
import "../styles/globals.css";

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
        <meta name="description" content="Paid to Party" />
        <meta name="keywords" content="Paid to Party" />
        <title>Paid to Party</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap"
          rel="stylesheet"></link>

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
      <div className="relative min-h-screen flex flex-col bg-white dark:bg-black text-black pb-24" id="app">
        <Navigation />
        <Component {...pageProps} />
      </div>
    </>
  )
}
