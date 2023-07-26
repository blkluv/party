"use client";

import { useUser } from "@clerk/nextjs";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
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
import { PublicUserMetadata } from "~/utils/userMetadataSchema";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

type PreviewUrl = { fileName: string; url: string };

const formSchema = createEventSchema
  .omit({
    startTime: true,
  })
  .extend({ startDate: z.date(), startTime: z.string() });

export const CreateEventForm = () => {
  const user = useUser();
  const isAdmin =
    user.user &&
    (user.user.publicMetadata as PublicUserMetadata).platformRole === "admin";

  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<PreviewUrl[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date(),
      isPublic: true,
      capacity: 100,
      location: "",
      // Ticket price is in dollars CAD
      ticketPrices: [{ name: "Regular", price: 10, isFree: true }],
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

  const onDrop = useCallback((files: File[]) => {
    setMediaFiles((prev) => [...prev, ...files]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    const urls: PreviewUrl[] = [];

    for (const f of mediaFiles) {
      const url = URL.createObjectURL(f);
      urls.push({ url, fileName: f.name });
    }

    setMediaPreviewUrls(urls);

    return () => {
      for (const u of urls) {
        URL.revokeObjectURL(u.url);
      }
    };
  }, [mediaFiles]);

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
        {mediaPreviewUrls.length > 0 && (
          <div className="space-y-2">
            <FormLabel>Media</FormLabel>
            <div className="grid grid-cols-3 gap-4">
              {mediaPreviewUrls.map((e) => (
                <div
                  className="relative h-64 w-full rounded-lg overflow-hidden"
                  key={e.url}
                >
                  <Image
                    src={e.url}
                    alt={e.fileName}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <FormLabel>Upload</FormLabel>
          <div
            {...getRootProps()}
            className="border p-2 flex justify-center items-center rounded-lg h-24 cursor-pointer hover:bg-gray-50 transition duration-75"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag and drop some files here, or click to select files</p>
            )}
          </div>
        </div>
        {isAdmin && (
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
                {!ticketPrices[i].isFree && (
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
                )}
                <FormField
                  control={form.control}
                  name={`ticketPrices.${i}.isFree`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Free</FormLabel>
                        <FormDescription>
                          Is this ticket option free?
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
        )}

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="block w-full">
                      {dayjs(field.value).format("DD-MM-YYYY")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex justify-center items-center">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
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
