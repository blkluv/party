"use client";

import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { inferProcedureOutput } from "@trpc/server";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import { AppRouter } from "~/app/api/trpc/trpc-router";
import { insertPromotionCodeSchema } from "~/db/schema";
import { trpc } from "~/utils/trpc";

const formSchema = insertPromotionCodeSchema.pick({
  code: true,
  couponId: true,
});

type FormData = z.infer<typeof formSchema>;
const getCouponString = (
  coupon?: inferProcedureOutput<AppRouter["events"]["getAllCoupons"]>[number]
) => {
  if (!coupon) {
    return "None";
  }
  return `${coupon.name} - %${coupon.percentageDiscount}`;
};
export const ManagePromotionCodes: FC<{ eventId: number }> = (props) => {
  const { data: codes = [], refetch: refetchCodes } =
    trpc.events.getAllPromotionCodes.useQuery({
      eventId: props.eventId,
    });
  const { data: coupons = [] } = trpc.events.getAllCoupons.useQuery({
    eventId: props.eventId,
  });
  const { mutateAsync: createPromotionCode } =
    trpc.events.createPromotionCode.useMutation({
      onSuccess: () => {
        refetchCodes();
      },
    });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      couponId: -1,
    },
  });

  const onSubmit = async (values: FormData) => {
    if (values.couponId === -1) {
      return;
    }

    await createPromotionCode({ ...values, eventId: props.eventId });
  };

  return (
    <div className="flex flex-col">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="ml-auto mb-2 mr-2">
            <p>Create Promotion Code</p>
            <PlusIcon className="ml-2 w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create Promotion Code</DialogTitle>
          <DialogDescription>
            Create a promotion code that uses an existing coupon. This code
            applies to all tickets sold for your event.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Promotion code" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the promotion code used to apply discounts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="couponId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => {
                          form.setValue("couponId", Number(val));
                        }}
                        value={field.value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue>
                            {getCouponString(
                              coupons.find((e) => e.id === field.value)
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {coupons.map((e) => (
                            <SelectItem
                              value={e.id.toString()}
                              key={`coupon ${e.id}`}
                            >
                              {getCouponString(e)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      This is the coupon that this promotion code will use. This
                      determines the discount applied.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                <p>Create Promotion Code</p>
                {form.formState.isSubmitting && (
                  <ArrowPathIcon className="ml-2 animate-spin w-4 h-4" />
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableCaption>A list of promotion codes for your event.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Coupon</TableHead>
            <TableHead>Discount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {codes.map((e) => (
            <TableRow key={`promo code ${e.id}`}>
              <TableCell>{e.code}</TableCell>
              <TableCell>{dayjs(e.createdAt).format("D/MM/YYYY")}</TableCell>
              <TableCell>{e.coupon.name}</TableCell>
              <TableCell>{e.coupon.percentageDiscount}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const ManagementContainer: FC<{ eventId: number }> = (props) => {
  return (
    <div>
      <ManagePromotionCodes eventId={props.eventId} />
    </div>
  );
};
