"use client";

import { FC } from "react";
import { Button } from "~/app/_components/ui/button";
import { TicketPrice } from "~/db/schema";
import { trpc } from "~/utils/trpc";

export const TicketTierListing: FC<{
  data: Pick<TicketPrice, "name" | "price" | "isFree" | "id">;
  eventId: number;
}> = (props) => {
  const { mutateAsync: createTicketCheckoutSession } =
    trpc.events.createTicketCheckoutSession.useMutation();
  const handleClaimTicket = async () => {
    const data = await createTicketCheckoutSession({
      ticketPriceId: props.data.id,
    });

    console.log(data);
  };
  return (
    <div className="border rounded-xl p-4 flex gap-4 items-center">
      <div className="flex-1">
        <p className="font-semibold">{props.data.name}</p>
        <p>{props.data.isFree ? "Free" : `$${props.data.price.toFixed(2)}`}</p>
      </div>
      <div>
        <Button
          onClick={() => {
            handleClaimTicket();
          }}
        >
          Claim Ticket
        </Button>
      </div>
    </div>
  );
};
