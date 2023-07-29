import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRightOnRectangleIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { match } from "ts-pattern";
import { MobileNavigationDrawer } from "./MobileNavigationDrawer";
import { Button } from "./ui/button";

export const Navigation = () => {
  const userAuth = auth();

  return (
    <>
      <div className="w-full sticky top-0 border-b border-gray-50 px-4 py-2 bg-neutral-900/90 backdrop-blur z-50 sm:block hidden">
        <div className="flex justify-between items-center">
          <Link href="/">
            <CubeIcon className="w-8 h-8" />
          </Link>
          {match(Boolean(userAuth.userId))
            .with(false, () => (
              <Link href="/sign-in">
                <Button>
                  <p>Login</p>
                  <ArrowRightOnRectangleIcon className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ))
            .with(true, () => <UserButton afterSignOutUrl="/" />)
            .exhaustive()}
        </div>
      </div>
      <div className="bottom-0 border-t w-full px-4 h-16 bg-neutral-900/90 backdrop-blur z-50 fixed sm:hidden flex justify-evenly items-start">
        <Link href="/" className="w-12 h-12 flex justify-center items-center">
          <CubeIcon className="w-8 h-8" />
        </Link>
        <MobileNavigationDrawer />
        {match(Boolean(userAuth.userId))
          .with(false, () => (
            <Link
              href="/sign-in"
              className="w-12 h-12 flex justify-center items-center"
            >
              <ArrowRightOnRectangleIcon className="w-8 h-8" />
            </Link>
          ))
          .with(true, () => (
            <div className="w-12 h-12 flex justify-center items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          ))
          .exhaustive()}
      </div>
    </>
  );
};
