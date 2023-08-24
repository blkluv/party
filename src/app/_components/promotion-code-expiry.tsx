"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export const PromotionCodeExpiryNotification = () => {
  const [open, setOpen] = useState(false);
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setOpen(true);
  }, [pathname]);

  return (
    <AlertDialog
      open={open}
      onOpenChange={() => {
        push(pathname);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Promotion Code Sold Out</AlertDialogTitle>
          <AlertDialogDescription>
            This promotion code is sold out.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
