import React, { FC, ReactNode } from "react";
import Head from "next/head";
import { APP_NAME } from "~/config/config";

interface Props {
  title: string;
  children?: ReactNode;
  description?: string;
  image?: string;
}

/**
 * Component for giving metadata to a given page.
 */
const MetaData: FC<Props> = ({ title, description, image, ...props }) => {
  const formattedTitle = `${title} | ${APP_NAME}`;

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
      />
      <link rel="manifest" href="/manifest.json" />
      <link href="/icons/icon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
      <link href="/icons/icon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
      <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
      <title>{formattedTitle}</title>
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {props?.children && props.children}
    </Head>
  );
};

export default MetaData;
