import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { getPageTitle } from "~/utils/getPageTitle";

export const metadata: Metadata = {
  title: getPageTitle("Sign In"),
};

export default function Page() {
  return (
    <div className="flex-1 justify-center flex items-center p-2">
      <SignIn />
    </div>
  );
}
