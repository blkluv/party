"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import type { ComponentProps, FC } from "react";
import { DEFAULT_EVENT_IMAGE } from "~/config/default-image";
import { trpc } from "~/utils/trpc";
import { useUploadImages } from "~/utils/uploads";
import type { EventMediaFileVariant, EventMediaUrlVariant } from "./EventForm";
import { EventForm } from "./EventForm";

export const CreateEventForm = () => {
  const { push, refresh } = useRouter();

  const uploadImages = useUploadImages();
  const { mutateAsync: createEventMedia } =
    trpc.events.media.createEventMedia.useMutation();

  const { mutateAsync: createEvent } = trpc.events.createEvent.useMutation();

  return (
    <EventForm
      onSubmit={async ({ startDate, eventMedia, ...values }) => {
        const [hour, minute] = values.startTime.split(":").map(Number);

        const newEvent = await createEvent({
          ...values,
          startTime: dayjs(startDate).hour(hour).minute(minute).toDate(),
        });

        if (eventMedia.length === 0) {
          // No media files. Set default
          await createEventMedia([
            {
              order: 0,
              isPoster: true,
              eventId: newEvent.id,
              url: DEFAULT_EVENT_IMAGE.url,
              imageId: DEFAULT_EVENT_IMAGE.id,
            },
          ]);
        } else {
          const downloadUrls = await uploadImages(
            eventMedia
              .filter((e): e is EventMediaFileVariant => e.__type === "file")
              .map((e) => e.file)
          );
          const isSomeMediaPoster = eventMedia.some((e) => e.isPoster);
          await createEventMedia(
            eventMedia.map((e, order) => ({
              order,
              // Default poster to first image
              isPoster: isSomeMediaPoster ? e.isPoster : order === 0,
              eventId: newEvent.id,
              url: downloadUrls[order].url,
              imageId: downloadUrls[order].id,
            }))
          );
        }

        refresh();
        push(`/events/${newEvent.id}`);
      }}
    />
  );
};
export const EditEventForm: FC<{
  initialValues: NonNullable<ComponentProps<typeof EventForm>["initialValues"]>;
  eventId: string;
}> = (props) => {
  const { push, refresh } = useRouter();
  const { mutateAsync: updateEvent } = trpc.events.updateEvent.useMutation();
  const { mutateAsync: createEventMedia } =
    trpc.events.media.createEventMedia.useMutation();
  const { mutateAsync: updateEventMedia } =
    trpc.events.media.updateEventMedia.useMutation();
  const { mutateAsync: deleteEventMedia } =
    trpc.events.media.deleteEventMedia.useMutation();
  const uploadImages = useUploadImages();

  return (
    <EventForm
      mode="edit"
      initialValues={props.initialValues}
      onSubmit={async ({ startDate, eventMedia, ...values }) => {
        const [hour, minute] = values.startTime.split(":").map(Number);

        const updatedEvent = await updateEvent({
          eventId: props.eventId,
          data: {
            ...values,
            startTime: dayjs(startDate).hour(hour).minute(minute).toDate(),
          },
        });

        if (eventMedia.length === 0) {
          // No media files. Set default
          await createEventMedia([
            {
              order: 0,
              isPoster: true,
              eventId: updatedEvent.id,
              url: DEFAULT_EVENT_IMAGE.url,
              imageId: DEFAULT_EVENT_IMAGE.id,
            },
          ]);
        } else {
          const eventMediaFiles = eventMedia.filter(
            (e): e is EventMediaFileVariant => e.__type === "file"
          );

          if (eventMediaFiles.length > 0) {
            const downloadUrls = await uploadImages(
              eventMediaFiles.map((e) => e.file)
            );
            const posterIndex = eventMedia.findIndex((e) => e.isPoster);

            await createEventMedia(
              eventMediaFiles.map((e, order) => ({
                order,
                // Default poster to first image
                isPoster: posterIndex !== -1 ? e.isPoster : order === 0,
                eventId: updatedEvent.id,
                url: downloadUrls[order].url,
                imageId: downloadUrls[order].id,
              }))
            );
          }

          // Check if we should make any updates
          const eventMediaUrls = props.initialValues.eventMedia.filter(
            (e): e is EventMediaUrlVariant => e.__type === "url"
          );

          // Find media that was present in initial, but missing in updated
          const deletedMedia = eventMediaUrls.filter(
            (e) => !eventMedia.some((m) => m.__type === "url" && m.id === e.id)
          );

          if (deletedMedia.length > 0) {
            await deleteEventMedia(deletedMedia.map((e) => ({ id: e.id })));
          }

          // Find all URLs in updated media that weren't deleted and submit for updating
          const updatedMedia = eventMedia.filter(
            (e): e is EventMediaUrlVariant =>
              e.__type === "url" && !deletedMedia.some((m) => m.id === e.id)
          );

          if (updatedMedia.length > 0) {
            await updateEventMedia(
              updatedMedia.map((e) => ({
                id: e.id,
                isPoster: e.isPoster,
                order: eventMedia.findIndex(
                  (m) => m.__type === "url" && m.id === e.id
                ),
              }))
            );
          }
        }

        refresh();
        push(`/events/${updatedEvent.id}`);
      }}
    />
  );
};
