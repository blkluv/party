"use client";

import { useUser } from "@clerk/nextjs";
import {
  ArrowDownTrayIcon,
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
import { SHOW_LOCATION_HOURS_THRESHOLD } from "~/config/constants";
import type { EventMedia, EventType } from "~/db/schema";
import { createEventSchema } from "~/utils/createEventSchema";
import { cn } from "~/utils/shadcn-ui";
import type { PublicUserMetadata } from "~/utils/userMetadataSchema";
import { LoadingSpinner } from "./LoadingSpinner";
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
    type: true,
  })
  .extend({
    startDate: z.date(),
    startTime: z.string(),
  });
export type EventFormData = z.infer<typeof formSchema>;

export const EventForm: FC<{
  mode?: "create" | "edit";
  type: EventType;
  initialValues?: EventFormData & {
    eventMedia: EventMediaFile[];
  };
  onSubmit: (
    values: Omit<z.infer<typeof createEventSchema>, "type"> & {
      eventMedia: EventMediaFile[];
    }
  ) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}> = (props) => {
  const { mode = "create" } = props;
  const user = useUser();
  const isAdmin = Boolean(
    user.user &&
      (user.user.publicMetadata as PublicUserMetadata).platformRole === "admin"
  );
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

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
      ? props.initialValues
      : {
          name: "",
          description: "",
          startDate: dayjs().add(1, "day").toDate(),
          capacity: 0,
          location: "",
          // Ticket price is in dollars CAD
          ticketPrices: [],
          // HH:MM
          startTime: dayjs().format("HH:mm"),
          hideLocation: false,
        },
  });

  const [ticketPrices] = form.watch(["ticketPrices"]);

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
          const [hour, minute] = values.startTime.split(":").map(Number);

          const startTime = dayjs(values.startDate)
            .hour(hour)
            .minute(minute)
            .toDate();

          return props.onSubmit({
            ...values,
            startTime,
            eventMedia: mediaFiles,
            capacity: ticketPrices.reduce(
              (sum, current) => sum + current.limit,
              0
            ),
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
                <Input placeholder={`New ${props.type}`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {props.type === "event" && (
          <>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hideLocation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-2 rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Hide Location</FormLabel>
                    <FormDescription>
                      {`If selected, the event's location appears to ticketholders ${SHOW_LOCATION_HOURS_THRESHOLD}h before it starts; if not, the location is immediately visible on the event page.`}
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

            {isAdmin && (
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
                              <Input
                                placeholder="Regular"
                                {...field}
                                disabled={
                                  Boolean(ticketPrices[i].id) &&
                                  props.mode === "edit"
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              The name of this ticket tier.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`ticketPrices.${i}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Description" {...field} />
                            </FormControl>
                            <FormDescription>
                              Describe any perks provided or anything else
                              people should know.
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
                                  disabled={
                                    Boolean(ticketPrices[i].id) &&
                                    props.mode === "edit"
                                  }
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
                        name={`ticketPrices.${i}.limit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ticket Limit</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Limit"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              The maximum number of tickets that are allowed to
                              be sold under this ticket tier.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`ticketPrices.${i}.visibility`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Always Visible
                              </FormLabel>
                              <FormDescription>
                                If checked, this ticket tier will always be
                                visible.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value === "always"}
                                onCheckedChange={() =>
                                  field.onChange(
                                    field.value === "default"
                                      ? "always"
                                      : "default"
                                  )
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
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
                                disabled={
                                  Boolean(ticketPrices[i].id) &&
                                  props.mode === "edit"
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        className="ml-auto"
                        variant="ghost"
                        disabled={props.mode === "edit"}
                        onClick={() => {
                          form.setValue(
                            "ticketPrices",
                            form
                              .getValues()
                              .ticketPrices.filter((_, j) => i !== j)
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
                        {
                          isFree: false,
                          name: "Regular",
                          price: 10,
                          limit: 10,
                          order: form.getValues("ticketPrices").length + 1,
                          visibility: "default",
                          description: "",
                        },
                      ]);
                    }}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    <p>Add Ticket Tier</p>
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
          </>
        )}
        <div className="flex gap-2 justify-center items-center">
          {props.onDelete && (
            <Button
              type="button"
              className="w-full flex-1 gap-2"
              variant="destructive"
              onClick={async () => {
                if (!props.onDelete) {
                  return;
                }

                try {
                  setIsDeleteLoading(true);
                  await props.onDelete();
                } catch (e) {
                  console.error("Error deleting");
                }
                setIsDeleteLoading(false);
              }}
            >
              <p>Delete</p>
              {isDeleteLoading && <LoadingSpinner />}
            </Button>
          )}
          <Button type="submit" className="w-full flex-1 gap-2">
            <p>{`${mode === "edit" ? "Edit" : "Create"} ${
              props.type === "event" ? "Event" : "Conversation"
            }`}</p>
            {form.formState.isSubmitting && <LoadingSpinner />}
          </Button>
        </div>
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
