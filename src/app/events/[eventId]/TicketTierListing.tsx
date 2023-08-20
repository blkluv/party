"use client";

import { useUser } from "@clerk/nextjs";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
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
  const user = useUser();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleClaimTicket = async () => {
    if (!user.isSignedIn) {
      setShowLoginPrompt(true);
      return;
    }

    const data = await createTicketCheckoutSession({
      ticketPriceId: props.data.id,
    });

    if (data) {
      refresh();
      push(data);
    }
  };
  return (
    <div className="relative border border-neutral-800 bg-neutral-800/25 shadow-lg rounded-xl p-4 sm:p-6 gap-4 items-center w-56 h-auto flex flex-col justify-between">
      {props.data.description.length > 0 && (
        <Dialog>
          <DialogTrigger className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
            <InformationCircleIcon className="w-6 h-6 fill-primary text-primary-foreground hover:fill-primary/90 rounded-full" />
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Ticket Tier Information</DialogTitle>
            <DialogDescription>
              Here&apos;s what this ticket tier unlocks.
            </DialogDescription>
            <div>
              <p>{props.data.description}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <p className="font-semibold text-center">{props.data.name}</p>
      <p className="font-bold text-4xl">
        {props.data.isFree ? "Free" : `$${props.data.price.toFixed(2)}`}
      </p>
      <Button
        className="w-full"
        disabled={props.disabled}
        onClick={() => {
          handleClaimTicket();
        }}
      >
        <p>Get Tickets</p>
        {isLoading && <LoadingSpinner className="ml-2" />}
      </Button>
      {showLoginPrompt && <LoginPrompt onOpenChange={setShowLoginPrompt} />}
    </div>
  );
};
