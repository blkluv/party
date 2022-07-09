import { useAuthenticator } from "@aws-amplify/ui-react";
import axios from "axios";
import { Form, Formik } from "formik";
import { useState } from "react";
import getToken from "~/utils/getToken";
import { Button, Input } from "./form";
import FormGroup from "./form/FormGroup";
import { LoadingIcon } from "./Icons";

const EventForm = () => {
  const { user } = useAuthenticator();

  const [posterData, setPosterData] = useState<File | null>(null);
  const [thumbnailData, setThumbnailData] = useState<File | null>(null);

  return (
    <Formik
      onSubmit={async (values) => {
        try {
          const { data: event } = await axios.post(
            "/api/events/create",
            {
              ...values,
              startTime: values.startTime.replace("T", " "),
              endTime: values.endTime.replace("T", " "),
              ticketPrice: 1000,
            },
            { headers: { Authorization: `Bearer ${getToken(user)}` } }
          );

          const {
            data: { uploadUrl: posterUploadUrl, downloadUrl: posterDownloadUrl },
          } = await axios.post(
            `/api/events/${event.id}/media/upload`,
            { name: posterData.name },
            { headers: { Authorization: `Bearer ${getToken(user)}` } }
          );
          await axios.put(posterUploadUrl, posterData);

          const {
            data: { uploadUrl: thumbnailUploadUrl, downloadUrl: thumbnailDownloadUrl },
          } = await axios.post(
            `/api/events/${event.id}/media/upload`,
            { name: thumbnailData.name },
            { headers: { Authorization: `Bearer ${getToken(user)}` } }
          );
          await axios.put(thumbnailUploadUrl, thumbnailData);

          await axios.post(
            `/api/events/${event.id}/update`,
            {
              posterUrl: posterDownloadUrl,
              thumbnailUrl: thumbnailDownloadUrl,
              ...values,
            },
            { headers: { Authorization: `Bearer ${getToken(user)}` } }
          );
        } catch (error) {
          console.error(error);
        }
      }}
      initialValues={{
        name: "",
        description: "",
        startTime: "2021-01-01T00:00:00",
        endTime: "2021-01-01T00:00:00",
        location: "",
        ticketPrice: 0,
        maxTickets: 0,
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-2">
          {isSubmitting && <LoadingIcon className="animate-spin" size={30} />}
          <FormGroup label="Event Name" name="name" placeholder="Event name" />
          <FormGroup label="Description" name="description" placeholder="Event description" />
          <FormGroup label="Start Time" name="startTime" placeholder="Event start time" type="datetime-local" />
          <FormGroup label="Location" name="location" placeholder="Event location (address, etc.)" />
          <p>Poster</p>
          <Input onChange={(e) => setPosterData(e.target.files[0])} type="file" />
          <p>Thumbnail</p>
          <Input onChange={(e) => setThumbnailData(e.target.files[0])} type="file" />
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
};

export default EventForm;
