"use client";

import {
  Bars3Icon,
  PlusIcon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { DialogClose } from "@radix-ui/react-dialog";
import Link from "next/link";
import { Drawer } from "vaul";
import { Button } from "./ui/button";

export const MobileNavigationDrawer = () => {
  return (
    <Drawer.Root>
      <Drawer.Trigger className="w-12 h-12 flex justify-center items-center">
        <Bars3Icon className="w-8 h-8" />
      </Drawer.Trigger>
      <Drawer.Overlay className="fixed inset-0 bg-black/40" />
      <Drawer.Portal>
        <Drawer.Content className="bg-black flex flex-col z-50 rounded-t-xl fixed bottom-0 left-0 right-0">
          <div className="rounded-full bg-gray-300 mx-auto h-1.5 w-1/6 my-2"></div>
          <div className="p-8 flex flex-col gap-4">
            <Link href="/events/new">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="flex gap-8 justify-start w-full"
                >
                  <PlusIcon className="w-8 h-8" />
                  <p className="font-medium text-lg">New Event</p>
                </Button>
              </DialogClose>
            </Link>
            <Link href="/events/new?discussion=true">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="flex gap-8 justify-start w-full"
                >
                  <PlusIcon className="w-8 h-8" />
                  <p className="font-medium text-lg">New Event Discussion</p>
                </Button>
              </DialogClose>
            </Link>
            <Link href="/tickets">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="flex gap-8 w-full justify-start"
                >
                  <TicketIcon className="w-8 h-8" />
                  <p className="font-medium text-lg">My Tickets</p>
                </Button>
              </DialogClose>
            </Link>
            <Link href="/events">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="flex gap-8 w-full justify-start"
                >
                  <UserGroupIcon className="w-8 h-8" />
                  <p className="font-medium text-lg">My Discussions & Events</p>
                </Button>
              </DialogClose>
            </Link>
          </div>
        </Drawer.Content>
        <Drawer.Overlay />
      </Drawer.Portal>
    </Drawer.Root>
  );
};
