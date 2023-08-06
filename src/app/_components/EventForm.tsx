"use client";

import { useUser } from "@clerk/nextjs";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import Image from "next/image";
import type { FC } from "react";
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
import type { EventMedia } from "~/db/schema";
import { createEventSchema } from "~/utils/createEventSchema";
import { cn } from "~/utils/shadcn-ui";
import type { PublicUserMetadata } from "~/utils/userMetadataSchema";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

type PreviewUrl = { fileName: string; url: string };

export type EventMediaFileVariant = { __type: "file"; file: File } & Pick<
  EventMedia,
  "isPoster"
>;
export type EventMediaUrlVariant = {
  __type: "url";
  url: string;
  id: string;
} & Pick<EventMedia, "isPoster">;
export type EventMediaFile = EventMediaFileVariant | EventMediaUrlVariant;

type MoveDirection = "left" | "right";

const formSchema = createEventSchema
  .omit({
    startTime: true,
  })
  .extend({
    startDate: z.date(),
    startTime: z.string(),
    isHosted: z.boolean().optional().default(false),
  });
export type EventFormData = z.infer<typeof formSchema>;

export const EventForm: FC<{
  mode?: "create" | "edit";
  initialValues?: EventFormData & { eventMedia: EventMediaFile[] };
  onSubmit: (
    values: EventFormData & { eventMedia: EventMediaFile[] }
  ) => Promise<void> | void;
}> = (props) => {
  const user = useUser();
  const isAdmin = Boolean(
    user.user &&
      (user.user.publicMetadata as PublicUserMetadata).platformRole === "admin"
  );

  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<PreviewUrl[]>(
    props.initialValues?.eventMedia
      .filter((e): e is EventMediaUrlVariant => e.__type === "url")
      .map((e) => ({ fileName: e.url, url: e.url })) ?? []
  );
  const [mediaFiles, setMediaFiles] = useState<EventMediaFile[]>(
    props.initialValues?.eventMedia ?? []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: props.initialValues
      ? { ...props.initialValues, isHosted: props.initialValues.capacity > 0 }
      : {
          name: "",
          description: "",
          startDate: new Date(),
          isPublic: true,
          isFeatured: isAdmin,
          capacity: 0,
          location: "",
          isHosted: false,
          // Ticket price is in dollars CAD
          ticketPrices: [],
          // HH:MM
          startTime: dayjs().format("HH:mm"),
          coupons: [],
        },
  });

  const [ticketPrices, coupons, isHosted] = form.watch([
    "ticketPrices",
    "coupons",
    "isHosted",
  ]);

  const onDrop = useCallback((files: File[]) => {
    setMediaFiles((prev) => [
      ...prev,
      ...files.map((file, i) => ({
        file,
        order: prev.length + i,
        isPoster: false,
        __type: "file" as const,
      })),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  useEffect(() => {
    const urls: PreviewUrl[] = [];

    for (const f of mediaFiles) {
      if (f.__type === "file") {
        const url = URL.createObjectURL(f.file);
        urls.push({ url, fileName: f.file.name });
      } else {
        urls.push({ url: f.url, fileName: f.url });
      }
    }

    setMediaPreviewUrls(urls);

    return () => {
      for (const u of urls) {
        URL.revokeObjectURL(u.url);
      }
    };
  }, [mediaFiles]);

  const handleMediaOrderChange = (index: number, direction: MoveDirection) => {
    const magnitude = direction === "right" ? 1 : -1;

    if (index + magnitude < 0 || index + magnitude > mediaFiles.length - 1) {
      return;
    }
    const newMediaFiles = [...mediaFiles];
    const tmp = newMediaFiles[index];

    newMediaFiles[index] = newMediaFiles[index + magnitude];
    newMediaFiles[index + magnitude] = tmp;

    setMediaFiles(newMediaFiles);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          return props.onSubmit({
            ...values,
            eventMedia: mediaFiles,
            capacity: values.isHosted ? 0 : values.capacity,
          });
        })}
        className="space-y-8"
      >
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
                This is the name of your new event.
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
              <FormDescription>Describe your new event.</FormDescription>
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
                  Public events are searchable on the home page, while
                  non-public events can still be accessed via a direct link to
                  their event page.
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
        {isAdmin && (
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Featured</FormLabel>
                  <FormDescription>
                    Featured events are shown at the top of the home page and
                    are generally promoted better than regular events.
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
        )}
        {mediaPreviewUrls.length > 0 && (
          <div className="space-y-2">
            <FormLabel>Media</FormLabel>

            <div className="grid grid-cols-2 gap-2">
              {mediaFiles.map((e, i) => (
                <MediaPreviewItem
                  onPosterToggle={() =>
                    setMediaFiles((prev) =>
                      prev.map((e, j) => ({ ...e, isPoster: i === j }))
                    )
                  }
                  key={`image ${i}`}
                  onMove={(dir) => handleMediaOrderChange(i, dir)}
                  onRemove={() =>
                    setMediaFiles((prev) => prev.filter((_, j) => i !== j))
                  }
                  order={i}
                  data={e}
                  maxIndex={mediaFiles.length - 1}
                  imageUrl={
                    mediaPreviewUrls.find(
                      (f) =>
                        f.fileName ===
                        (e.__type === "file" ? e.file.name : e.url)
                    )?.url ?? ""
                  }
                />
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <div className="space-y-0.5">
            <FormLabel>Event Images</FormLabel>
          </div>
          <div
            {...getRootProps()}
            className="border p-2 flex justify-center flex-col gap-2 items-center rounded-lg h-24 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition duration-75 text-sm text-neutral-600 dark:text-neutral-300"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <>
                <ArrowDownTrayIcon className="w-6 h-6" />
                <p>Drop images here</p>
              </>
            ) : (
              <>
                <ArrowUpTrayIcon className="w-6 h-6" />
                <p>Upload images</p>
              </>
            )}
          </div>
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
              <FormDescription>
                The location where this event will take place.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isHosted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Hosted</FormLabel>
                <FormDescription>Are you hosting this event?</FormDescription>
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
        {isHosted && (
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
                  Maximum ticket limit prevents further purchases after reaching
                  the specified number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {isAdmin && props.mode !== "edit" && (
          <>
            <div className="space-y-2">
              <Label>Ticket Tiers</Label>
              {ticketPrices.map((_, i) => (
                <div
                  key={`ticketPrices.${i}`}
                  className="bg-neutral-50 dark:bg-neutral-900 dark:border shadow-inner dark:shadow-none rounded-xl p-4 flex flex-col gap-2"
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
                          The name of this ticket tier.
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
                            <Input
                              placeholder="Price"
                              type="number"
                              {...field}
                            />
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
                            Is this ticket tier free?
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
                  <Button
                    type="button"
                    className="ml-auto"
                    variant="ghost"
                    onClick={() => {
                      form.setValue(
                        "ticketPrices",
                        form.getValues().ticketPrices.filter((_, j) => i !== j)
                      );
                    }}
                  >
                    <XMarkIcon className="w-4 h-4 mr-2" />
                    <p>Remove Ticket Tier</p>
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="flex"
                onClick={() => {
                  const values = form.getValues();
                  form.setValue("ticketPrices", [
                    ...values.ticketPrices,
                    { isFree: false, name: "Ticket", price: 1 },
                  ]);
                }}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                <p>Add Ticket Tier</p>
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Coupons</Label>
              {coupons.map((_, i) => (
                <div
                  key={`coupons.${i}`}
                  className="bg-neutral-50 dark:bg-neutral-900 dark:border shadow-inner dark:shadow-none rounded-xl p-4 flex flex-col gap-2"
                >
                  <FormField
                    control={form.control}
                    name={`coupons.${i}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Regular" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of this coupon.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`coupons.${i}.percentageDiscount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Percentage Discount</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Percentage discount"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This percentage amount will be deducted from the sale
                          price of the tickets.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    className="ml-auto"
                    variant="ghost"
                    onClick={() => {
                      form.setValue(
                        "coupons",
                        form.getValues().coupons.filter((_, j) => i !== j)
                      );
                    }}
                  >
                    <XMarkIcon className="w-4 h-4 mr-2" />
                    <p>Remove Coupon</p>
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="flex"
                onClick={() => {
                  const values = form.getValues();
                  form.setValue("coupons", [
                    ...values.coupons,
                    { name: "Coupon", percentageDiscount: 10 },
                  ]);
                }}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                <p>Add Coupon</p>
              </Button>
            </div>
          </>
        )}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between flex items-center"
                      >
                        <p>{dayjs(field.value).format("DD-MM-YYYY")}</p>
                        <CalendarIcon className="w-4 h-4" />
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          <p>{props.mode === "edit" ? "Edit" : "Create"} Event</p>
          {form.formState.isSubmitting && (
            <ArrowPathIcon className="ml-2 animate-spin w-4 h-4" />
          )}
        </Button>
      </form>
    </Form>
  );
};

const MediaPreviewItem: FC<{
  onRemove: () => void;
  onMove: (_dir: MoveDirection) => void;
  data: EventMediaFile;
  imageUrl: string;
  onPosterToggle: () => void;
  order: number;
  maxIndex: number;
}> = (props) => {
  return (
    <div className="h-52 rounded-lg overflow-hidden relative group text-white">
      <div className="absolute top-0 left-0 bg-black/60 backdrop-blur-sm rounded-br-xl flex gap-1">
        <div className="flex justify-center items-center w-8 h-8">
          <p className="text-sm">#{props.order + 1}</p>
        </div>
        <div className="flex gap-2">
          {props.order > 0 && (
            <button
              type="button"
              className="hover:text-neutral-200 transition duration-75 h-full px-2 flex justify-center items-center"
              onClick={() => props.onMove("left")}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
          )}
          {props.order < props.maxIndex && (
            <button
              type="button"
              className="hover:text-neutral-200 transition duration-75 h-full px-2 flex justify-center items-center"
              onClick={() => props.onMove("right")}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="absolute top-0 right-0 bg-black/60 backdrop-blur-sm rounded-bl-xl flex gap-1 text-white">
        <button
          className="flex justify-center items-center w-8 h-8"
          onClick={() => props.onRemove()}
          type="button"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
      <Image
        src={props.imageUrl}
        alt={
          props.data.__type === "file" ? props.data.file.name : props.data.url
        }
        width={300}
        height={300}
        className="w-full h-full object-cover"
      />
      <button
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-t-xl text-sm py-1 px-2 items-center justify-center gap-2",
          props.data.isPoster
            ? "flex"
            : "group-hover:flex hover:text-neutral-200 transition duration-75 hidden animate-fade-in"
        )}
        type="button"
        onClick={() => props.onPosterToggle()}
      >
        {props.data.isPoster ? (
          <>
            <p>Poster</p>
            <PhotoIcon className="w-4 h-4" />
          </>
        ) : (
          <p>Set as poster</p>
        )}
      </button>
    </div>
  );
};
