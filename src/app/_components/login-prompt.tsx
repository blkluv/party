"use client";

import { useRouter } from "next/router";
import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/app/_components/ui/dialog";
import { Button } from "./ui/button";

export const LoginPrompt: FC<{
  onOpenChange: (_val: boolean) => void;
}> = (props) => {
  const { push } = useRouter();
  return (
    <Dialog {...props} open={true}>
      <DialogContent>
        <DialogTitle>Login Required</DialogTitle>
        <DialogDescription>You must be logged in to do this.</DialogDescription>
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
