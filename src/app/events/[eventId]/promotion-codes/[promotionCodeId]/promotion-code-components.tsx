"use client";

import { Card, LineChart, Title } from "@tremor/react";
import dayjs from "dayjs";
import { useMemo, type FC } from "react";
import { groupBy, map, pipe, reduce, toPairs } from "remeda";
import type { Ticket } from "~/db/schema";

export const TicketPerformanceChart: FC<{
  data: Pick<Ticket, "id" | "createdAt" | "quantity" | "userId">[];
}> = (props) => {
  const data = useMemo(() => {
    return pipe(
      props.data,
      groupBy((e) => dayjs(e.createdAt).format("DD/MM/YYYY")),
      toPairs,
      map(([k, v]) => ({
        timestamp: k,
        "Tickets Sold": reduce(v, (sum, curr) => sum + curr.quantity, 0),
      }))
    );
  }, [props.data]);

  return (
    <Card>
      <Title>Ticket Sales</Title>
      <LineChart
        className="mt-6"
        data={data}
        index="timestamp"
        categories={["Tickets Sold"]}
        colors={["orange"]}
        yAxisWidth={40}
      />
    </Card>
  );
};
