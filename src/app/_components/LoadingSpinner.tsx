import type { FC } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { cn } from "~/utils/shadcn-ui";

export const LoadingSpinner: FC<{ size?: number; className?: string }> = ({
  size = 16,
  ...props
}) => {
  return (
    <AiOutlineLoading
      size={size}
      className={cn("animate-spin", props.className)}
    />
  );
};
