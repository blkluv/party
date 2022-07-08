import axios from "axios";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import PartyBoxEvent from "~/types/PartyBoxEvent";
import { Button } from "./form";
import FormGroup from "./form/FormGroup";
import { OutlinedMinusIcon, OutlinedPlusIcon } from "./Icons";

interface Props {
  event: PartyBoxEvent;
}

const TicketsForm = ({ event }: Props) => {
  const [tickets, setTickets] = useState(1);
  const router = useRouter();

  const handleTicketsChange = (value: number) => {
    const newTickets = tickets + value;

    if (newTickets < 1) return;

    setTickets(newTickets);
  };

  return (
    <div className="border border-gray-800 rounded-md p-2 flex flex-col gap-4">
      <Formik
        onSubmit={async ({ name, phoneNumber }) => {
          try {
            const { data: stripeUrl } = await axios.post(`/api/events/${event.id}/tickets/begin-purchase`, {
              name,
              phone_number: phoneNumber,
            });

            await router.push(stripeUrl);
          } catch (error) {
            console.error(error);
          }
        }}
        initialValues={{
          name: "",
          phoneNumber: "",
        }}
      >
        <Form className="flex flex-col gap-4">
          <FormGroup name="name" placeholder="Name" label="Name" />
          <FormGroup name="phoneNumber" placeholder="Phone Number" label="Phone Number" type="tel" />
          <div>
            <p className="text-center mb-2">Number of Tickets</p>
            <div className="flex gap-4 items-center justify-center">
              <OutlinedMinusIcon onClick={() => handleTicketsChange(-1)} size={25} className="primary-hover" />
              <p className="font-bold text-center text-xl">{tickets}</p>
              <OutlinedPlusIcon onClick={() => handleTicketsChange(1)} size={25} className="primary-hover" />
            </div>
          </div>
          <div className="flex justify-center">
            <Button type="submit">Submit</Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default TicketsForm;
