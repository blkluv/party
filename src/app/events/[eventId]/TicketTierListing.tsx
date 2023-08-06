"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useState } from "react";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/app/_components/ui/dialog";
import type { TicketPrice } from "~/db/schema";
import { trpc } from "~/utils/trpc";

export const TicketTierListing: FC<{
  data: Pick<TicketPrice, "name" | "price" | "isFree" | "id">;
  eventId: string;
}> = (props) => {
  const { mutateAsync: createTicketCheckoutSession, isLoading } =
    trpc.events.createTicketPurchaseUrl.useMutation();

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
    <div className="border border-neutral-800 bg-neutral-800/25 shadow-lg rounded-xl p-4 gap-4 items-center w-56 h-56 flex flex-col justify-between">
      <p className="font-semibold">{props.data.name}</p>
      <p className="font-bold text-4xl">
        {props.data.isFree ? "Free" : `$${props.data.price.toFixed(2)}`}
      </p>
      <Button
        className="w-full"
        onClick={() => {
          handleClaimTicket();
        }}
      >
        <p>Claim Ticket</p>
        {isLoading && <LoadingSpinner className="ml-2" />}
      </Button>
      {showLoginPrompt && <LoginPrompt onOpenChange={setShowLoginPrompt} />}
    </div>
  );
};

const LoginPrompt: FC<{
  onOpenChange: (_val: boolean) => void;
}> = (props) => {
  const { push } = useRouter();
  return (
    <Dialog {...props} open={true}>
      <DialogContent>
        <DialogTitle>Login Required</DialogTitle>
        <DialogDescription>
          You must be logged in to purchase tickets.
        </DialogDescription>
        <div className="flex justify-end gap-2">
          <Button onClick={() => props.onOpenChange(false)} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => push("/sign-in")}>Login</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};