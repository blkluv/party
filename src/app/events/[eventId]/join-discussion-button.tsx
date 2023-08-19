"use client";

import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { FC } from "react";
import { Button } from "~/app/_components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/app/_components/ui/tooltip";

export const JoinDiscussionButton: FC<{
  disabled?: boolean;
  eventId: string;
}> = (props) => {
  const disabledText =
    "Purchase a ticket for this event to join the live discussion.";

  // Show tooltip on large screens where hover is supported
  // Show popover on small screens
  if (props.disabled) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="sm:block hidden">
                <JoinDiscussionButtonInner disabled={props.disabled} />
              </div>
            </TooltipTrigger>
            <TooltipContent>{disabledText}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Popover>
          <PopoverTrigger asChild>
            <div className="sm:hidden">
              <JoinDiscussionButtonInner disabled={props.disabled} />
            </div>
          </PopoverTrigger>
          <PopoverContent>{disabledText}</PopoverContent>
        </Popover>
      </>
    );
  }
  return (
    <Link href={`/events/${props.eventId}/chat`}>
      <JoinDiscussionButtonInner />
    </Link>
  );
};
const JoinDiscussionButtonInner: FC<{
  disabled?: boolean;
}> = (props) => {
  return (
    <Button disabled={props.disabled}>
      <div className="mr-2 relative">
        <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
        <div className="animate-pulse absolute bg-green-500 rounded-full w-2 h-2 top-0 right-0 translate-x-1/3 -translate-y-1/3" />
      </div>
      <p>Join Discussion</p>
    </Button>
  );
};
