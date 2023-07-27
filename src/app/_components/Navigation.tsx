import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";

export const Navigation = () => {
  return (
    <div className="w-full sticky top-0 border-b border-gray-50 px-4 py-2 bg-white/80 backdrop-blur z-50">
      <div className="flex justify-between items-center">
        <Link href="/">Party Box</Link>
        <Link href="/events/new">
          <Button>Create Event</Button>
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
