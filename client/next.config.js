/* eslint-disable require-await */
/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

const prod = process.env.NODE_ENV === "production";

const nextConfig = withPWA({
  reactStrictMode: true,
  pwa: {
    disable: prod ? false : true,
    dest: "public",
    runtimeCaching,
  },
  images: {
    domains: ["party-box-bucket.s3.amazonaws.com"],
  },
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: `https://fm2aaoc5el.execute-api.us-east-1.amazonaws.com/dev/:path*`,
    },
  ],
});

module.exports = nextConfig;
