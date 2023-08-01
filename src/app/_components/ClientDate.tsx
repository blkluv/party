"use client";

import dayjs from "dayjs";
import type { FC } from "react";
import { useMemo } from "react";

export const ClientDate: FC<{ date: Date; format?: string }> = (props) => {
  const str = useMemo(() => {
    return dayjs(props.date).format(
      props.format ?? "dddd MMMM D, YYYY [at] h:mm a"
    );
  }, [props.date, props.format]);

  return <>{str}</>;
};
