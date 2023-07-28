"use client";

import { Bars3Icon, PlusIcon, TicketIcon } from "@heroicons/react/24/outline";
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
        <Drawer.Content className="bg-white flex flex-col z-50 rounded-t-xl fixed bottom-0 left-0 right-0 border-t border-gray-400">
          <div className="rounded-full bg-gray-300 mx-auto h-1.5 w-1/6 my-2"></div>
          <div className="p-8 flex flex-col gap-4">
            <Link href="/events/new">
              <Button
                variant="ghost"
                className="flex gap-8 justify-start w-full"
              >
                <PlusIcon className="w-8 h-8" />
                <p className="font-medium text-lg">Create Event</p>
              </Button>
            </Link>
            <Link href="/tickets">
              <Button
                variant="ghost"
                className="flex gap-8 w-full justify-start"
              >
                <TicketIcon className="w-8 h-8" />
                <p className="font-medium text-lg">Tickets</p>
              </Button>
            </Link>
          </div>
        </Drawer.Content>
        <Drawer.Overlay />
      </Drawer.Portal>
    </Drawer.Root>
  );
};