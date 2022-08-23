import { PartyBoxEvent } from "@party-box/common";
import axios from "axios";
import dayjs from "dayjs";
import { EventFormData, EventFormDate } from "~/types/EventFormInput";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(localeData);

const dateConvert = (date: EventFormDate) => {
  return dayjs()
    .year(Number(date.year))
    .month(Number(date.month))
    .date(Number(date.day))
    .hour(date.modifier === "PM" ? Number(date.hour) + 12 : Number(date.hour))
    .minute(Number(date.minute))
    .second(0)
    .millisecond(0);
};

interface CreateEventParameters {
  values: EventFormData;
  media: (File | string)[];
  thumbnail: File | string;
  mode: "create" | "edit";
  setUploadState: (_: string) => void;
  originalEventId?: number;
}

/**
 * Creates an event and throws an error if it fails.
 * @param parameters
 */
const createEvent = async ({
  values,
  media,
  setUploadState,
  originalEventId,
  thumbnail,
  mode,
}: CreateEventParameters): Promise<PartyBoxEvent> => {
  let eventId = null;

  setUploadState(mode === "create" ? "Creating event" : "Updating event");

  const eventData = {
    ...values,
    hostId: Number(values.hostId),
    maxTickets: Number(values.maxTickets),
    startTime: dateConvert(values.startTime).toISOString(),
    endTime: dateConvert(values.endTime).toISOString(),
    prices: values.prices.map((p) => ({ ...p, price: Number(p.price) })),
    notifications: values.notifications.map((n) => ({
      messageTime: dateConvert(values.startTime)
        .subtract(Number(n.days), "days")
        .subtract(Number(n.hours), "hours")
        .subtract(Number(n.minutes), "minutes")
        .toISOString(),
      message: n.message,
    })),
  };

  if (mode === "create") {
    const { data: event } = await axios.post("/api/events/create", eventData);
    eventId = event.id;
  } else {
    eventId = originalEventId;

    await axios.post(`/api/events/${eventId}/update`, eventData);
  }

  const posters = [];
  let mediaUploadCount = 0;

  // We can only upload one file at a time.
  for (const file of media) {
    setUploadState(`Uploading media: ${++mediaUploadCount}/${media.length}`);

    // If this is a string, we must have already uploaded this
    if (typeof file === "string") {
      posters.push(file);
      continue;
    }

    const {
      data: { uploadUrl: posterUploadUrl, downloadUrl: posterDownloadUrl },
    } = await axios.post(`/api/events/${eventId}/media/upload`, { name: file.name });
    await axios.put(posterUploadUrl, file);

    // Keep track of the poster download URLs so we can update the event with them later
    posters.push(posterDownloadUrl);
  }

  setUploadState("Uploading thumbnail");

  let thumbnailDownloadUrl = "";

  // If thumbnail is a string, we know we've already uploaded it
  // Since it's an S3 link
  if (typeof thumbnail === "string") {
    thumbnailDownloadUrl = thumbnail;
  } else {
    const {
      data: { uploadUrl: thumbnailUploadUrl, downloadUrl },
    } = await axios.post(`/api/events/${eventId}/media/upload`, { name: thumbnail.name });
    await axios.put(thumbnailUploadUrl, thumbnail);

    thumbnailDownloadUrl = downloadUrl;
  }

  setUploadState("Updating event");

  const { data } = await axios.post<PartyBoxEvent>(`/api/events/${eventId}/update`, {
    media: posters,
    thumbnail: thumbnailDownloadUrl,
  });
  setUploadState("Done");

  return data;
};

export default createEvent;
