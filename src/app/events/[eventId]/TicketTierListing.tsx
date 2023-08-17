"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useState } from "react";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { LoginPrompt } from "~/app/_components/login-prompt";
import { Button } from "~/app/_components/ui/button";
import type { TicketPrice } from "~/db/schema";
import { trpc } from "~/utils/trpc";

export const TicketTierListing: FC<{
  data: Pick<TicketPrice, "name" | "price" | "isFree" | "id" | "limit">;
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
    <div className="border border-neutral-800 bg-neutral-800/25 shadow-lg rounded-xl p-4 sm:p-6 gap-4 items-center w-56 h-auto flex flex-col justify-between">
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
        <p>Get Tickets</p>
        {isLoading && <LoadingSpinner className="ml-2" />}
      </Button>
      {showLoginPrompt && <LoginPrompt onOpenChange={setShowLoginPrompt} />}
    </div>
  );
};
