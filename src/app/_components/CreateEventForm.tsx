"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/app/_components/ui/button";
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
import { createEventSchema } from "~/utils/createEventSchema";
import { trpc } from "~/utils/trpc";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

const formSchema = createEventSchema
  .omit({
    startTime: true,
  })
  .extend({ startDate: z.date(), startTime: z.string() });

export const CreateEventForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date(),
      isPublic: true,
      capacity: 100,
      location: "",
      ticketPrices: [{ name: "ticket", price: 5, isFree: false }],
      // HH:MM
      startTime: `${new Date()
        .getHours()
        .toString()
        .padStart(2, "0")}:${new Date()
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
    },
  });

  const [ticketPrices] = form.watch(["ticketPrices"]);

  const { mutateAsync: createEvent, isLoading } =
    trpc.events.createEvent.useMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const [hour, minute] = values.startTime.split(":").map(Number);

    await createEvent({
      ...values,
      startTime: dayjs(values.startDate).hour(hour).minute(minute).toDate(),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="New event" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your new event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormDescription>Describe your new event</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public</FormLabel>
                <FormDescription>
                  Whether this event is open to the public or not
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Capacity</FormLabel>
              <FormControl>
                <Input placeholder="Capacity" type="number" {...field} />
              </FormControl>
              <FormDescription>
                The maximum number of tickets sold
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Label>Ticket Options</Label>
          {ticketPrices.map((_, i) => (
            <div
              key={`ticketPrices.${i}`}
              className="bg-gray-50 shadow-inner rounded-xl p-4 space-y-2"
            >
              <FormField
                control={form.control}
                name={`ticketPrices.${i}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Regular" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of this ticket option.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`ticketPrices.${i}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Price" type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      The cost of the ticket, in dollars CAD
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button
            type="button"
            onClick={() => {
              const values = form.getValues();
              form.setValue("ticketPrices", [
                ...values.ticketPrices,
                { isFree: false, name: "Ticket", price: 1 },
              ]);
            }}
          >
            Add Ticket Option
          </Button>
        </div>

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                />
              </FormControl>
              <FormDescription>When does your event start?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormDescription>When does your event start?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          <p>Create Event</p>
          {isLoading && <ArrowPathIcon className="ml-2 animate-spin w-4 h-4" />}
        </Button>
      </form>
    </Form>
  );
};
