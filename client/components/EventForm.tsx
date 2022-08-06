import { useAuthenticator } from "@aws-amplify/ui-react";
import axios from "axios";
import { ErrorMessage, FieldArray, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { PartyBoxEvent } from "@party-box/common";
import deleteEvent from "~/utils/deleteEvent";
import getToken from "~/utils/getToken";
import { Button, CustomErrorMessage, FileUploadField, Input, Select, TextArea } from "./form";
import FormGroup from "./form/FormGroup";
import FormPreviewImage from "./FormPreviewImage";
import { CloseIcon, LoadingIcon } from "./Icons";
import { EventFormData, EventFormDate } from "~/types/EventFormInput";
import formatEventFormValues from "~/utils/formatEventFormValues";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import eventFormSchema from "~/schema/eventFormSchema";

dayjs.extend(localeData);

interface Props {
  initialValues?: PartyBoxEvent;
}

const defaultEventData: EventFormData = {
  name: "",
  description: "",
  startTime: {
    minute: dayjs().minute().toString(),
    hour: dayjs().hour().toString(),
    day: dayjs().date().toString(),
    month: dayjs().month().toString(),
    year: dayjs().year().toString(),
    modifier: "PM",
  },
  endTime: {
    minute: dayjs().minute().toString(),
    hour: (dayjs().hour() + 4).toString(),
    day: dayjs().date().toString(),
    month: dayjs().month().toString(),
    year: dayjs().year().toString(),
    modifier: "PM",
  },
  prices: [
    {
      name: "Regular",
      price: "10",
    },
  ],
  location: "TBD",
  maxTickets: "100",
  hashtags: [],
  notifications: [
    {
      days: "0",
      hours: "6",
      minutes: "0",
      message: "{name} starts in 6h. Location is {location}",
    },
    {
      days: "0",
      hours: "3",
      minutes: "0",
      message: "{name} starts in 3h. Location is {location}",
    },
    {
      days: "0",
      hours: "0",
      minutes: "0",
      message: "{name} starts now. Location is {location}",
    },
  ],
};

const dateConvert = (date: EventFormDate) => {
  return dayjs()
    .year(Number(date.year))
    .month(Number(date.month))
    .date(Number(date.day))
    .hour(date.modifier === "PM" ? Number(date.hour) + 12 : Number(date.hour))
    .minute(Number(date.minute))
    .second(0);
};

const EventForm: FC<Props> = ({ initialValues }) => {
  const { user } = useAuthenticator();
  const router = useRouter();
  const mode = initialValues ? "edit" : "create";

  const [media, setMedia] = useState<(File | string)[]>(initialValues?.media ?? []);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialValues?.media ?? []);
  const [uploadState, setUploadState] = useState("");
  const [thumbnail, setThumbnail] = useState<File | string>(initialValues?.thumbnail ?? null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialValues?.thumbnail ?? "");

  // Every time media changes, generate preview URLs for all media in the array
  useEffect(() => {
    const newPreviews = media.map((e) => (typeof e === "string" ? e : URL.createObjectURL(e)));
    setPreviewUrls(newPreviews);

    return () => {
      newPreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [media]);

  // Every time the thumbnail changes, update the preview URL
  useEffect(() => {
    if (!thumbnail || typeof thumbnail === "string") return;
    const url = URL.createObjectURL(thumbnail);
    setThumbnailPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [thumbnail]);

  // Add a new file to the array of media files
  const addMediaImage = (file: File) => {
    if (!file) return;
    setMedia((prev) => [...prev, file]);
  };

  const removeImage = (index: number) => {
    const url = previewUrls[index];
    setMedia((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(url);
  };

  // Move the media left/right in the array
  const moveMedia = (index: number, direction: "left" | "right") => {
    if ((index === 0 && direction === "left") || (index === media.length - 1 && direction === "right")) return;
    const directionValue = direction === "left" ? -1 : 1;

    const newMedia = [...media];
    const tmpFile = newMedia[index];
    newMedia[index] = newMedia[index + directionValue];
    newMedia[index + directionValue] = tmpFile;
    setMedia(newMedia);

    const newPreviewUrls = [...previewUrls];
    const tmpUrl = newPreviewUrls[index];
    newPreviewUrls[index] = newPreviewUrls[index + directionValue];
    newPreviewUrls[index + directionValue] = tmpUrl;
    setPreviewUrls(newPreviewUrls);
  };

  return (
    <Formik
      validationSchema={eventFormSchema}
      onSubmit={async (values) => {
        let eventId = null;
        try {
          setUploadState("Creating event");

          const eventData = {
            ...values,
            published: true,
            maxTickets: Number(values.maxTickets),
            startTime: dateConvert(values.startTime),
            endTime: dateConvert(values.endTime),
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
            const { data: event } = await axios.post("/api/events/create", eventData, {
              headers: { Authorization: `Bearer ${getToken(user)}` },
            });
            eventId = event.id;
          } else {
            eventId = initialValues.id;

            await axios.post(`/api/events/${eventId}/update`, eventData, {
              headers: { Authorization: `Bearer ${getToken(user)}` },
            });
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
            } = await axios.post(
              `/api/events/${eventId}/media/upload`,
              { name: file.name },
              { headers: { Authorization: `Bearer ${getToken(user)}` } }
            );
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
            } = await axios.post(
              `/api/events/${eventId}/media/upload`,
              { name: thumbnail.name },
              { headers: { Authorization: `Bearer ${getToken(user)}` } }
            );
            await axios.put(thumbnailUploadUrl, thumbnail);

            thumbnailDownloadUrl = downloadUrl;
          }

          setUploadState("Updating event");

          await axios.post(
            `/api/events/${eventId}/update`,
            {
              media: posters,
              thumbnail: thumbnailDownloadUrl,
            },
            { headers: { Authorization: `Bearer ${getToken(user)}` } }
          );
          setUploadState("Done");

          await router.push(`/events/${eventId}`);
        } catch (error) {
          // Delete the event and its resources if we run into an error during creation
          console.error(error);
          setUploadState("Deleting event");

          await deleteEvent(eventId, getToken(user));
        }
      }}
      initialValues={initialValues ? formatEventFormValues(initialValues) : defaultEventData}
    >
      {({ isSubmitting, values, handleChange }) => (
        <Form className="flex flex-col gap-2">
          <FormGroup label="Event Name" name="name">
            <Input onChange={handleChange} name="name" placeholder="Event name" value={values.name} />
          </FormGroup>
          <div>
            <div className="form-label-group">
              <p>Description</p>
              <ErrorMessage name={"description"} component={CustomErrorMessage} />
            </div>
            <TextArea
              name="description"
              placeholder="Description"
              rows={5}
              onChange={handleChange}
              value={values.description}
            />
          </div>
          <p>Event Date</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid grid-cols-3 gap-1">
              <FormGroup name="startTime.day" label="Day">
                <Select name="startTime.day" placeholder="Day" onChange={handleChange} value={values.startTime.day}>
                  {[
                    ...Array(
                      dayjs().year(Number(values.startTime.year)).month(Number(values.startTime.month)).daysInMonth()
                    ),
                  ].map((_, day) => (
                    <option key={day} value={day.toString()}>
                      {day + 1}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup name="startTime.month" label="Month">
                <Select name="startTime.month" onChange={handleChange} value={values.startTime.month}>
                  {dayjs
                    .localeData()
                    .monthsShort()
                    .map((month, i) => (
                      <option key={month} value={i.toString()}>
                        {month}
                      </option>
                    ))}
                </Select>
              </FormGroup>
              <FormGroup name="startTime.year" label="Year">
                <Select name="startTime.year" onChange={handleChange} value={values.startTime.year}>
                  {[...Array(5)].map((_, year) => (
                    <option key={year} value={(dayjs().year() + year).toString()}>
                      {dayjs().year() + year}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <FormGroup label="Hour" name="startTime.hour">
                <Input
                  name="startTime.hour"
                  placeholder="Hour"
                  type="number"
                  onChange={handleChange}
                  value={values.startTime.hour}
                  min={1}
                  max={12}
                />
              </FormGroup>
              <FormGroup label="Minute" name="startTime.minute">
                <Input name="startTime.minute" onChange={handleChange} value={values.startTime.minute} />
              </FormGroup>
              <FormGroup label="Modifier" name="startTime.modifier">
                <Select name="startTime.modifier" onChange={handleChange} value={values.startTime.modifier}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Select>
              </FormGroup>
            </div>
          </div>
          <FormGroup label="Location" name="location">
            <Input
              onChange={handleChange}
              name="location"
              value={values.location}
              placeholder="Event location (address, etc.)"
            />
          </FormGroup>
          <FormGroup label="Maximum Tickets Sold" name="maxTickets">
            <Input
              onChange={handleChange}
              name="maxTickets"
              value={values.maxTickets}
              placeholder="Max tickets"
              type="number"
            />
          </FormGroup>
          <p>Media</p>
          <FileUploadField onChange={addMediaImage} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-center my-2">
            {previewUrls.map((image, previewIndex) => (
              <FormPreviewImage
                key={`preview ${previewIndex}`}
                removeImage={() => removeImage(previewIndex)}
                name={
                  typeof media[previewIndex] === "string"
                    ? (media[previewIndex] as string)
                    : (media[previewIndex] as File)?.name
                }
                image={image}
                position={previewIndex + 1}
                onMoveLeft={() => moveMedia(previewIndex, "left")}
                onMoveRight={() => moveMedia(previewIndex, "right")}
              />
            ))}
          </div>
          <p>Thumbnail</p>
          {!thumbnail && <FileUploadField onChange={setThumbnail} />}
          {thumbnailPreview.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-center">
              <FormPreviewImage
                removeImage={() => {
                  setThumbnail(null);
                  setThumbnailPreview("");
                }}
                name={typeof thumbnail === "string" ? thumbnail : thumbnail.name}
                image={thumbnailPreview}
              />
            </div>
          )}
          <p>Ticket Prices</p>

          <FieldArray name="prices">
            {({ push, remove }) => (
              <>
                {values.prices.map((e, i) => (
                  <div key={`price ${i}`} className="flex flex-col gap-2 bg-gray-800 p-3 rounded-md shadow-md relative">
                    <div
                      className="bg-gray-900 rounded-full p-0.5 flex justify-center items-center absolute top-0 right-0 z-10 transform -translate-y-1/2 translate-x-1/2 border border-gray-700 shadow-md hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => remove(i)}
                    >
                      <CloseIcon />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormGroup name={`prices.${i}.name`} label="Name">
                        <Input
                          onChange={handleChange}
                          name={`prices.${i}.name`}
                          value={values.prices[i].name}
                          placeholder="Name"
                        />
                      </FormGroup>
                      <FormGroup name={`prices.${i}.price`} label="Price">
                        <Input
                          onChange={handleChange}
                          name={`prices.${i}.price`}
                          value={values.prices[i].price}
                          placeholder="Price"
                          type="number"
                        />
                      </FormGroup>
                    </div>
                  </div>
                ))}
                <div className="flex">
                  <Button variant="outline" onClick={() => push({ name: "", price: "0" })}>
                    New Price
                  </Button>
                </div>
              </>
            )}
          </FieldArray>
          <p>Notifications</p>
          <FieldArray name="notifications">
            {({ push, remove }) => (
              <>
                {values.notifications.map((e, i) => (
                  <div
                    key={`notification ${i}`}
                    className="flex flex-col gap-2 bg-gray-800 p-3 rounded-md shadow-md relative"
                  >
                    <div
                      className="bg-gray-900 rounded-full p-0.5 flex justify-center items-center absolute top-0 right-0 z-10 transform -translate-y-1/2 translate-x-1/2 border border-gray-700 shadow-md hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => remove(i)}
                    >
                      <CloseIcon />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <FormGroup name={`notifications.${i}.days`} label="Days">
                        <Input
                          onChange={handleChange}
                          name={`notifications.${i}.days`}
                          value={values.notifications[i].days}
                          type="number"
                        />
                      </FormGroup>
                      <FormGroup name={`notifications.${i}.hours`} label="Hours">
                        <Input
                          onChange={handleChange}
                          name={`notifications.${i}.hours`}
                          value={values.notifications[i].hours}
                          type="number"
                        />
                      </FormGroup>
                      <FormGroup name={`notifications.${i}.minutes`} label="Minutes">
                        <Input
                          onChange={handleChange}
                          name={`notifications.${i}.minutes`}
                          value={values.notifications[i].minutes}
                          type="number"
                        />
                      </FormGroup>
                    </div>
                    <TextArea
                      name={`notifications.${i}.message`}
                      placeholder="Message"
                      className="h-24"
                      onChange={handleChange}
                      value={values.notifications[i].message}
                    />
                  </div>
                ))}
                <div className="flex">
                  <Button variant="outline" onClick={() => push({ message: "", days: "", hours: "", minutes: "" })}>
                    New Notification
                  </Button>
                </div>
              </>
            )}
          </FieldArray>

          {!isSubmitting && (
            <div className="flex justify-center">
              <Button type="submit">Submit</Button>
            </div>
          )}
          {isSubmitting && (
            <div className="flex items-center gap-4 justify-center">
              <LoadingIcon className="animate-spin" size={25} />
              <p>{uploadState}</p>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default EventForm;
