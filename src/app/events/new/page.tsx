import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreateEventForm } from "~/app/_components/CreateEventForm";
import { getPageTitle } from "~/utils/getPageTitle";

export const metadata: Metadata = {
  title: getPageTitle("New Event"),
};

const Page = () => {
  const userAuth = auth();
  if (!userAuth.userId) {
    redirect("/sign-in");
  }
  return (
    <div className="mx-2 sm:mx-auto sm:w-full max-w-lg my-8">
      <CreateEventForm />
    </div>
  );
};

export default Page;
