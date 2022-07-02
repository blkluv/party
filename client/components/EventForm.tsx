import axios from "axios";
import { Form, Formik } from "formik";
import { useState } from "react";
import { Button, Input } from "./form";
import FormGroup from "./form/FormGroup";

const EventForm = () => {
  const [posterData, setPosterData] = useState<File | null>(null);
  console.log(posterData);

  return (
    <Formik
      onSubmit={async (values) => {
        console.log(values);
        try {
          const formData = new FormData();

          formData.append("file", posterData, posterData.name);
          const { data: event } = await axios.post("/api/events/create", {
            ...values,
            start_time: values.start_time.replace("T", " "),
            end_time: values.end_time.replace("T", " "),
            owner_id: "something",
          });
          const { data } = await axios.post(`/api/events/${event.id}/media`, formData);
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
        poster: {
          name: "",
          alt_text: "",
          type: "image",
        },
      }}
    >
      <Form className="flex flex-col gap-2">
        <FormGroup label="Event Name" name="name" placeholder="Event name" />
        <FormGroup label="Description" name="description" placeholder="Event description" />
        <FormGroup label="Start Time" name="start_time" placeholder="Event start time" />
        <FormGroup label="Location" name="location" placeholder="Event location (address, etc.)" />
        <Input onChange={(e) => setPosterData(e.target.files[0])} type="file" />
        <Button type="submit">Submit</Button>
      </Form>
    </Formik>
  );
};

export default EventForm;
