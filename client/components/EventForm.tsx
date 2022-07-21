import { useAuthenticator } from "@aws-amplify/ui-react";
import axios from "axios";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import deleteEvent from "~/utils/deleteEvent";
import getToken from "~/utils/getToken";
import { Button, CustomErrorMessage, FileUploadField, Input, TextArea } from "./form";
import FormGroup from "./form/FormGroup";
import FormPreviewImage from "./FormPreviewImage";
import { CloseIcon, LoadingIcon } from "./Icons";

const EventForm = () => {
  const { user } = useAuthenticator();
  const router = useRouter();

  const [media, setMedia] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadState, setUploadState] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  // Every time media changes, generate preview URLs for all media in the array
  useEffect(() => {
    const newPreviews = media.map((e) => URL.createObjectURL(e));
    setPreviewUrls(newPreviews);

    return () => {
      newPreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [media]);

  // Every time the thumbnail changes, update the preview URL
  useEffect(() => {
    if (!thumbnail) return;
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
      onSubmit={async (values) => {
        let eventId = "";
        try {
          setUploadState("Creating event");
          const { data: event } = await axios.post(
            "/api/events/create",
            {
              ...values,
              startTime: values.startTime.replace("T", " "),
              endTime: values.endTime.replace("T", " "),
              ticketPrice: Number(values.ticketPrice),
              notifications: values.notifications.map((n) => ({
                days: Number(n.days),
                hours: Number(n.hours),
                minutes: Number(n.minutes),
                message: n.message,
              })),
            },
            { headers: { Authorization: `Bearer ${getToken(user)}` } }
          );

          eventId = event.id;

          const posters = [];
          let mediaUploadCount = 0;

          // We can only upload one file at a time.
          for (const file of media) {
            setUploadState(`Uploading media: ${++mediaUploadCount}/${media.length}`);
            const {
              data: { uploadUrl: posterUploadUrl, downloadUrl: posterDownloadUrl },
            } = await axios.post(
              `/api/events/${event.id}/media/upload`,
              { name: file.name },
              { headers: { Authorization: `Bearer ${getToken(user)}` } }
            );
            await axios.put(posterUploadUrl, file);

            // Keep track of the poster download URLs so we can update the event with them later
            posters.push(posterDownloadUrl);
          }

          setUploadState("Uploading thumbnail");

          const {
            data: { uploadUrl: thumbnailUploadUrl, downloadUrl: thumbnailDownloadUrl },
          } = await axios.post(
            `/api/events/${event.id}/media/upload`,
            { name: thumbnail.name },
            { headers: { Authorization: `Bearer ${getToken(user)}` } }
          );
          await axios.put(thumbnailUploadUrl, thumbnail);

          setUploadState("Updating event");

          await axios.post(
            `/api/events/${event.id}/update`,
            {
              media: posters,
              thumbnail: thumbnailDownloadUrl,
              ...values,
              published: true,
            },
            { headers: { Authorization: `Bearer ${getToken(user)}` } }
          );
          setUploadState("Done");

          router.push(`/events/${eventId}`);
        } catch (error) {
          // Delete the event and its resources if we run into an error during creation
          console.error(error);
          setUploadState("Deleting event");

          await deleteEvent(eventId, getToken(user));
        }
      }}
      initialValues={{
        name: "",
        description: "",
        startTime: new Date().toISOString().slice(0, 16),
        endTime: new Date().toISOString().slice(0, 16),
        location: "",
        ticketPrice: 0,
        maxTickets: 0,
        hashtags: [],
        notifications: [],
      }}
    >
      {({ isSubmitting, values, handleChange }) => (
        <Form className="flex flex-col gap-2">
          <FormGroup label="Event Name" name="name" placeholder="Event name" />
          <div>
            <div className="form-label-group">
              <p>Description</p>
              <ErrorMessage name={"description"} component={CustomErrorMessage} />
            </div>
            <TextArea
              name="description"
              placeholder="Description"
              className="h-36"
              onChange={handleChange}
              value={values.description}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Start Time" name="startTime" placeholder="Event start time" type="datetime-local" />
            <FormGroup label="End Time" name="endTime" placeholder="Event end time" type="datetime-local" />
          </div>
          <FormGroup label="Location" name="location" placeholder="Event location (address, etc.)" />
          <FormGroup label="Ticket Price" name="ticketPrice" placeholder="Ticket price" type="number" />
          <FormGroup label="Maximum Tickets Sold" name="maxTickets" placeholder="Max tickets" type="number" />
          <p>Media</p>
          <FileUploadField onChange={addMediaImage} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-center my-2">
            {previewUrls.map((image, previewIndex) => (
              <FormPreviewImage
                key={`preview ${previewIndex}`}
                removeImage={() => removeImage(previewIndex)}
                name={media[previewIndex].name}
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
                name={thumbnail.name}
                image={thumbnailPreview}
              />
            </div>
          )}
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
                    <div className="grid grid-cols-3 gap-4">
                      <FormGroup name={`notifications.${i}.days`} placeholder="Days" type="number" label="Days" />
                      <FormGroup name={`notifications.${i}.hours`} placeholder="Hours" type="number" label="Hours" />
                      <FormGroup
                        name={`notifications.${i}.minutes`}
                        placeholder="Minutes"
                        type="number"
                        label="Minutes"
                      />
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
                <div className="flex ">
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
