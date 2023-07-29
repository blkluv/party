import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "~/utils/shadcn-ui";
import { Navigation } from "./_components/Navigation";
import { TrpcProvider } from "./_components/trpc-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn(inter.className, "dark")}>
          <TrpcProvider>
            <div className="min-h-screen bg-white dark:bg-neutral-900 text-black dark:text-white flex flex-col">
              <Navigation />
              <div className="flex flex-col flex-1">{children}</div>
            </div>
          </TrpcProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
