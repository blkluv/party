import { UserButton, auth } from "@clerk/nextjs";
import {
  ArrowRightOnRectangleIcon,
  CubeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { match } from "ts-pattern";
import { isUserPlatformAdmin } from "~/utils/isUserPlatformAdmin";
import { MobileNavigationDrawer } from "./MobileNavigationDrawer";
import { CreateDropdownMenu } from "./create-dropdown-menu";
import { Button } from "./ui/button";

export const Navigation = async () => {
  const userAuth = auth();
  const isAdmin = await isUserPlatformAdmin();

  return (
    <>
      <div className="w-full sticky top-0 border-b px-4 py-2 bg-neutral-900/90 backdrop-blur z-50 sm:block hidden">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <CubeIcon className="w-8 h-8" />
            </Link>
            {userAuth.userId && (
              <>
                <Link href="/events">
                  <Button variant="ghost">My Conversations & Events</Button>
                </Link>
                <Link href="/tickets">
                  <Button variant="ghost">My Tickets</Button>
                </Link>
              </>
            )}
          </div>
          {match(Boolean(userAuth.userId))
            .with(false, () => (
              <Link href="/sign-in">
                <Button variant="ghost">
                  <ArrowRightOnRectangleIcon className="mr-2 w-4 h-4" />
                  <p>Login</p>
                </Button>
              </Link>
            ))
            .with(true, () => (
              <div className="flex items-center gap-4">
                {isAdmin && <CreateDropdownMenu />}

                {!isAdmin && (
                  <Link href="/discussions/new">
                    <Button size="sm">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      <p>Create Discussion</p>
                    </Button>
                  </Link>
                )}
                <UserButton afterSignOutUrl="/" />
              </div>
            ))
            .exhaustive()}
        </div>
      </div>
      <div className="bottom-0 border-t left-0 right-0 px-4 h-16 bg-neutral-900/90 backdrop-blur z-50 fixed sm:hidden flex justify-evenly items-start">
        <Link href="/" className="w-12 h-12 flex justify-center items-center">
          <CubeIcon className="w-8 h-8" />
        </Link>
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
            <>
              <MobileNavigationDrawer />

              <div className="w-12 h-12 flex justify-center items-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ))
          .exhaustive()}
      </div>
    </>
  );
};
