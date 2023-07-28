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
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useState } from "react";
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
import { EventMedia } from "~/db/schema";
import { createEventSchema } from "~/utils/createEventSchema";
import { cn } from "~/utils/shadcn-ui";
import { trpc } from "~/utils/trpc";
import { useUploadImages } from "~/utils/uploads";
import { PublicUserMetadata } from "~/utils/userMetadataSchema";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

type PreviewUrl = { fileName: string; url: string };
type MediaFile = { file: File } & Pick<EventMedia, "isPoster">;
type MoveDirection = "left" | "right";

const formSchema = createEventSchema
  .omit({
    startTime: true,
  })
  .extend({ startDate: z.date(), startTime: z.string() });

export const CreateEventForm = () => {
  const user = useUser();
  const { push } = useRouter();
  const isAdmin =
    user.user &&
    (user.user.publicMetadata as PublicUserMetadata).platformRole === "admin";

  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<PreviewUrl[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const uploadImages = useUploadImages();
  const { mutateAsync: createEventMedia } =
    trpc.events.media.createEventMedia.useMutation();

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

  const { mutateAsync: createEvent } = trpc.events.createEvent.useMutation();

  const onDrop = useCallback((files: File[]) => {
    setMediaFiles((prev) => [
      ...prev,
      ...files.map((file, i) => ({
        file,
        order: prev.length + i,
        isPoster: false,
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
      const url = URL.createObjectURL(f.file);
      urls.push({ url, fileName: f.file.name });
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

    const newEvent = await createEvent({
      ...values,
      startTime: dayjs(values.startDate).hour(hour).minute(minute).toDate(),
    });

    const downloadUrls = await uploadImages(mediaFiles.map((e) => e.file));
    const isSomeMediaPoster = mediaFiles.some((e) => e.isPoster);

    await createEventMedia(
      mediaFiles.map((e, order) => ({
        order,
        // Default poster to first image
        isPoster: isSomeMediaPoster ? e.isPoster : order === 0,
        eventId: newEvent.id,
        url: downloadUrls[order],
      }))
    );

    push(`/events/${newEvent.slug}`);
  };

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
                    mediaPreviewUrls.find((f) => f.fileName === e.file.name)
                      ?.url ?? ""
                  }
                />
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <FormLabel>Upload</FormLabel>
          <div
            {...getRootProps()}
            className="border p-2 flex justify-center flex-col gap-2 items-center rounded-lg h-24 cursor-pointer hover:bg-gray-50 transition duration-75 text-sm text-gray-600"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <>
                <ArrowDownTrayIcon className="w-6 h-6" />
                <p>Drop files here</p>
              </>
            ) : (
              <>
                <ArrowUpTrayIcon className="w-6 h-6" />
                <p>Upload files</p>
              </>
            )}
          </div>
        </div>
        {isAdmin && (
          <div className="space-y-2">
            <Label>Ticket Tiers</Label>
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
              Add Ticket Tier
            </Button>
          </div>
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
                {/* <FormDescription>When does your event start?</FormDescription> */}
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
                {/* <FormDescription>When does your event start?</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">
          <p>Create Event</p>
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
  data: MediaFile;
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
              className="hover:text-gray-200 transition duration-75 h-full px-2 flex justify-center items-center"
              onClick={() => props.onMove("left")}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
          )}
          {props.order < props.maxIndex && (
            <button
              type="button"
              className="hover:text-gray-200 transition duration-75 h-full px-2 flex justify-center items-center"
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
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
      <Image
        src={props.imageUrl}
        alt={props.data.file.name}
        width={300}
        height={300}
        className="w-full h-full object-cover"
      />
      <button
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-t-xl text-sm py-1 px-2 items-center justify-center gap-2",
          props.data.isPoster
            ? "flex"
            : "group-hover:flex hover:text-gray-200 transition duration-75 hidden animate-fade-in"
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
