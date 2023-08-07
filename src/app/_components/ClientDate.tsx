"use client";

import dayjs from "dayjs";
import type { FC } from "react";
import { useEffect, useState } from "react";

export const ClientDate: FC<{ date: Date; format?: string }> = (props) => {
  const str = useClientDate(props);

  return <>{str}</>;
};

export const useClientDate: FC<{ date: Date; format?: string }> = (props) => {
  const [str, setStr] = useState("");

  useEffect(() => {
    setStr(
      dayjs(props.date).format(props.format ?? "dddd MMMM D, YYYY [at] h:mm a")
    );
  }, [props]);

  return str;
};
