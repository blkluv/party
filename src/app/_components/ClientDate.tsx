"use client";

import dayjs from "dayjs";
import { FC, useMemo } from "react";

export const ClientDate: FC<{ date: Date }> = (props) => {
  const str = useMemo(() => {
    return dayjs(props.date).format("dddd MMMM D, YYYY [at] h:mm a");
  }, [props.date]);

  return <>{str}</>;
};
