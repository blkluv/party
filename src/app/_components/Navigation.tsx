import { UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";

export const Navigation = () => {
  return (
    <div className="w-full sticky top-0 border-b border-gray-100 px-4 py-2">
      <div className="flex justify-between items-center">
        <div>Party Box</div>
        <Link href="/events/new">
          <Button>Create Event</Button>
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
