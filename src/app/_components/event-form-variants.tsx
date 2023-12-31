"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps, FC } from "react";
import { DEFAULT_EVENT_IMAGE } from "~/config/default-image";
import type { EventType } from "~/db/schema";
import { trpc } from "~/utils/trpc";
import { useUploadImages } from "~/utils/uploads";
import type { EventMediaFileVariant, EventMediaUrlVariant } from "./EventForm";
import { EventForm } from "./EventForm";

export const CreateEventForm: FC<{ type: EventType }> = (props) => {
  const { push, refresh } = useRouter();

  const uploadImages = useUploadImages();
  const { mutateAsync: createEventMedia } =
    trpc.events.media.createEventMedia.useMutation();

  const { mutateAsync: createEvent } = trpc.events.createEvent.useMutation();

  return (
    <EventForm
      type={props.type}
      onSubmit={async ({ eventMedia, ...values }) => {
        const newEvent = await createEvent({ ...values, type: props.type });

        if (eventMedia.length === 0) {
          // No media files. Set default
          await createEventMedia({
            eventId: newEvent.id,
            media: [
              {
                order: 0,
                isPoster: true,
                eventId: newEvent.id,
                url: DEFAULT_EVENT_IMAGE.url,
                imageId: DEFAULT_EVENT_IMAGE.id,
              },
            ],
          });
        } else {
          const downloadUrls = await uploadImages({
            files: eventMedia
              .filter((e): e is EventMediaFileVariant => e.__type === "file")
              .map((e) => e.file),
            eventId: newEvent.id,
          });
          const isSomeMediaPoster = eventMedia.some((e) => e.isPoster);
          await createEventMedia({
            eventId: newEvent.id,
            media: eventMedia.map((e, order) => ({
              order,
              // Default poster to first image
              isPoster: isSomeMediaPoster ? e.isPoster : order === 0,
              eventId: newEvent.id,
              url: downloadUrls[order].url,
              imageId: downloadUrls[order].id,
            })),
          });
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
  type: EventType;
  onDelete: () => void | Promise<void>;
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
      type={props.type}
      mode="edit"
      initialValues={props.initialValues}
      onDelete={props.onDelete}
      onSubmit={async ({ eventMedia, ...values }) => {
        const updatedEvent = await updateEvent({
          eventId: props.eventId,
          data: values,
        });

        if (eventMedia.length === 0) {
          // No media files. Set default
          await createEventMedia({
            eventId: props.eventId,
            media: [
              {
                order: 0,
                isPoster: true,
                eventId: updatedEvent.id,
                url: DEFAULT_EVENT_IMAGE.url,
                imageId: DEFAULT_EVENT_IMAGE.id,
              },
            ],
          });
        } else {
          const eventMediaFiles = eventMedia.filter(
            (e): e is EventMediaFileVariant => e.__type === "file"
          );

          if (eventMediaFiles.length > 0) {
            const downloadUrls = await uploadImages({
              files: eventMediaFiles.map((e) => e.file),
              eventId: props.eventId,
            });
            const posterIndex = eventMedia.findIndex((e) => e.isPoster);

            await createEventMedia({
              eventId: props.eventId,
              media: eventMediaFiles.map((e, order) => ({
                order,
                // Default poster to first image
                isPoster: posterIndex !== -1 ? e.isPoster : order === 0,
                eventId: updatedEvent.id,
                url: downloadUrls[order].url,
                imageId: downloadUrls[order].id,
              })),
            });
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
            await deleteEventMedia({
              ids: deletedMedia.map((e) => ({ id: e.id })),
              eventId: props.eventId,
            });
          }

          // Find all URLs in updated media that weren't deleted and submit for updating
          const updatedMedia = eventMedia.filter(
            (e): e is EventMediaUrlVariant =>
              e.__type === "url" && !deletedMedia.some((m) => m.id === e.id)
          );

          if (updatedMedia.length > 0) {
            await updateEventMedia({
              eventId: props.eventId,
              media: updatedMedia.map((e) => ({
                id: e.id,
                isPoster: e.isPoster,
                order: eventMedia.findIndex(
                  (m) => m.__type === "url" && m.id === e.id
                ),
              })),
            });
          }
        }

        refresh();
        push(`/events/${updatedEvent.id}`);
      }}
    />
  );
};
