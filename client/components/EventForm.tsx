import axios from "axios";
import { Form, Formik } from "formik";
import { useState } from "react";
import { Button, Input } from "./form";
import FormGroup from "./form/FormGroup";

const EventForm = () => {
  const [posterData, setPosterData] = useState<File | null>(null);
  const [thumbnailData, setThumbnailData] = useState<File | null>(null);

  return (
    <Formik
      onSubmit={async (values) => {
        try {
          const { data: event } = await axios.post("/api/events/create", {
            ...values,
            start_time: values.start_time.replace("T", " "),
            end_time: values.end_time.replace("T", " "),
            owner_id: "something",
            ticket_price: 500,
          });

          const {
            data: { uploadUrl: posterUploadUrl, downloadUrl: posterDownloadUrl },
          } = await axios.post(`/api/events/${event.id}/media/upload`, { name: posterData.name });
          await axios.put(posterUploadUrl, posterData);

          const {
            data: { uploadUrl: thumbnailUploadUrl, downloadUrl: thumbnailDownloadUrl },
          } = await axios.post(`/api/events/${event.id}/media/upload`, { name: thumbnailData.name });
          await axios.put(thumbnailUploadUrl, thumbnailData);

          await axios.post(`/api/events/${event.id}/update`, {
            poster_url: posterDownloadUrl,
            thumbnail_url: thumbnailDownloadUrl,
            ...values,
          });
        } catch (error) {
          console.error(error);
        }
      }}
      initialValues={{
        name: "",
        description: "",
        start_time: "2021-01-01T00:00:00",
        end_time: "2021-01-01T00:00:00",
        location: "",
        ticket_price: 0,
        max_tickets: 0,
      }}
    >
      <Form className="flex flex-col gap-2">
        <FormGroup label="Event Name" name="name" placeholder="Event name" />
        <FormGroup label="Description" name="description" placeholder="Event description" />
        <FormGroup label="Start Time" name="start_time" placeholder="Event start time" type="datetime-local" />
        <FormGroup label="Location" name="location" placeholder="Event location (address, etc.)" />
        <Input onChange={(e) => setPosterData(e.target.files[0])} type="file" />
        <Input onChange={(e) => setThumbnailData(e.target.files[0])} type="file" />
        <Button type="submit">Submit</Button>
      </Form>
    </Formik>
  );
};

export default EventForm;
