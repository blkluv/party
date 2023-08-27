import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { env } from "~/config/env";
import { getPageTitle } from "~/utils/getPageTitle";
import { cn } from "~/utils/shadcn-ui";
import { Navigation } from "./_components/Navigation";
import { TrpcProvider } from "./_components/trpc-provider";
import { Toaster } from "./_components/ui/toaster";

import Script from "next/script";
import { Footer } from "./_components/footer";
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
  keywords: [
    "University of Guelph parties",
    "Student events Guelph",
    "Guelph campus parties",
    "College parties Guelph",
    "Social events on campus",
    "Party Box Guelph",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "dark")}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "white",
              colorTextOnPrimaryBackground: "black",
            },
          }}
        >
          <TrpcProvider>
            <div className="pb-16 md:pb-0">
              <div className="min-h-screen bg-white dark:bg-neutral-900 text-black dark:text-white flex flex-col">
                <Navigation />
                <div className="flex flex-col flex-1">{children}</div>
              </div>
              <Footer />
            </div>
            <Toaster />
          </TrpcProvider>
        </ClerkProvider>
        <Analytics />
        <Script
          defer
          src="https://unpkg.com/@tinybirdco/flock.js"
          data-host="https://api.us-east.tinybird.co"
          data-token="p.eyJ1IjogIjFiZTNhYTlkLWQxNWQtNDk0OS04NDUyLWJmNmU0MTgwM2VkMyIsICJpZCI6ICIwNGNjYWRkNS04ZDZlLTRlMGItYWRhZi0wZjAyMTAzOWMyYTAiLCAiaG9zdCI6ICJ1c19lYXN0In0.SSNsEzXNvbXNXQTRa3grygTgQuFymmadrKkG0z-uwyU"
        />
      </body>
    </html>
  );
}
