const pwa = require("next-pwa");
const prod = process.env.NODE_ENV === "production";

const withPwa = pwa({
  disable: !prod,
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = withPwa({
  reactStrictMode: true,
  images: {
    domains: ["party-box-bucket.s3.us-east-1.amazonaws.com", "www.gravatar.com"],
  },
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: `https://api.party-box.ca/${prod ? "prod" : "dev"}/:path*`,
    },
  ],
});

module.exports = nextConfig;
