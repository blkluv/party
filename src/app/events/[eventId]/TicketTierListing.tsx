"use client";

import { useUser } from "@clerk/nextjs";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { TicketIcon } from "@heroicons/react/24/outline";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import type { FC } from "react";
import { useState } from "react";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { LoginPrompt } from "~/app/_components/login-prompt";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import type { TicketPrice } from "~/db/schema";
import { trpc } from "~/utils/trpc";

export const TicketTierListing: FC<{
  data: Pick<
    TicketPrice,
    "name" | "price" | "isFree" | "id" | "limit" | "description"
  >;
  eventId: string;
  disabled?: boolean;
}> = (props) => {
  const { mutateAsync: createTicketCheckoutSession, isLoading } =
    trpc.events.tickets.createTicketPurchaseUrl.useMutation();

  const { push, refresh } = useRouter();
  const searchParams = useSearchParams();
  const user = useUser();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleClaimTicket = async () => {
    if (!user.isSignedIn) {
      setShowLoginPrompt(true);
      return;
    }

    const data = await createTicketCheckoutSession({
      ticketPriceId: props.data.id,
      promotionCode: searchParams.get("promotionCode") ?? undefined,
    });

    if (data) {
      refresh();
      push(data);
    }
  };
  return (
    <div className="relative border border border-neutral-800/50 bg-neutral-800/20 shadow-lg rounded-2xl p-4 sm:p-6 items-center flex w-full">
      <p className="font-semibold text-center">{props.data.name}</p>
      {props.data.description.length > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-1">
              <InformationCircleIcon className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col">
            <DialogTitle>{props.data.name}</DialogTitle>
            <DialogDescription>Ticket Tier Information</DialogDescription>
            <div>
              <p className="whitespace-pre">{props.data.description}</p>
            </div>
            <DialogClose asChild>
              <Button className="w-full sm:w-max sm:ml-auto" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
      <p className="font-bold ml-auto">
        {props.data.isFree ? "Free" : `$${props.data.price.toFixed(2)}`}
      </p>
      <Button
        className="gap-2 ml-4"
        disabled={props.disabled}
        onClick={() => {
          handleClaimTicket();
        }}
      >
        <TicketIcon className="w-4 h-4" />
        <p>Buy</p>
        {isLoading && <LoadingSpinner />}
      </Button>
      {showLoginPrompt && <LoginPrompt onOpenChange={setShowLoginPrompt} />}
    </div>
  );
};
