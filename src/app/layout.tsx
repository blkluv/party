import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { env } from "~/config/env";
import { getPageTitle } from "~/utils/getPageTitle";
import { cn } from "~/utils/shadcn-ui";
import { Navigation } from "./_components/Navigation";
import { TrpcProvider } from "./_components/trpc-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_WEBSITE_URL),
  title: getPageTitle(),
  description:
    "Party Box is a cutting-edge web platform that aims to revolutionize the way university students discover and share parties and events. Party Box caters to the spontaneous nature of parties and other gatherings, empowering users to stay socially connected.",
  openGraph: {
    url: env.NEXT_PUBLIC_WEBSITE_URL,
    images: [{ url: "/images/partybox-meta.png", width: 1200, height: 630 }],
    title: getPageTitle(),
    description:
      "Party Box is a cutting-edge web platform that aims to revolutionize the way university students discover and share parties and events. Party Box caters to the spontaneous nature of parties and other gatherings, empowering users to stay socially connected.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "dark")}>
        <ClerkProvider>
          <TrpcProvider>
            <div className="min-h-screen bg-white dark:bg-neutral-900 text-black dark:text-white flex flex-col pb-16 sm:pb-0">
              <Navigation />
              <div className="flex flex-col flex-1">{children}</div>
            </div>
          </TrpcProvider>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}
