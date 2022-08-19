import { Button, Input, Modal } from "@conorroberts/beluga";
import { PartyBoxEventPrice } from "@party-box/common";
import { Form, Formik } from "formik";
import Link from "next/link";
import { FC, useState } from "react";
import FormGroup from "./form/FormGroup";
import { OutlinedMinusIcon, OutlinedPlusIcon } from "./Icons";
import * as Yup from "yup";

const EventPrice: FC<PartyBoxEventPrice> = ({ price, paymentLink, free, name }) => {
  const [showTicketModal, setShowTicketModal] = useState(false);

  return (
    <>
      <Modal
        open={showTicketModal}
        onOpenChange={setShowTicketModal}
        title="Get Tickets"
        description="Get tickets for this free event!"
      >
        <Formik
          initialValues={{
            name: "",
            ticketQuantity: 1,
            phoneNumber: "",
          }}
          onSubmit={async (values) => {
            await new Promise((resolve) =>
              setTimeout(() => {
                console.log(values);
                resolve(values);
              }, 1000)
            );
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required("Name is required"),
            ticketQuantity: Yup.number().required("Ticket quantity is required").min(1).max(10),
            phoneNumber: Yup.string().required("Phone number is required").length(10, "Phone number must be 10 digits"),
          })}
        >
          {({ handleChange, values, handleSubmit, setFieldValue, errors }) => (
            <Form onSubmit={handleSubmit} className="flex gap-4 flex-col">
              <FormGroup error={errors.name} label="Name">
                <Input name="name" onChange={handleChange} value={values.name} />
              </FormGroup>
              <FormGroup error={errors.phoneNumber} label="Phone Number">
                <Input name="phoneNumber" onChange={handleChange} type="tel" value={values.phoneNumber} />
              </FormGroup>
              <div>
                <p>Ticket Quantity</p>
                <div className="flex items-center gap-8 mt-2">
                  <Button
                    variant="text"
                    type="button"
                    onClick={() =>
                      setFieldValue("ticketQuantity", values.ticketQuantity - 1 <= 0 ? 1 : values.ticketQuantity - 1)
                    }
                  >
                    <OutlinedMinusIcon size={25} />
                  </Button>
                  <span className="font-bold text-xl">{values.ticketQuantity}</span>
                  <Button
                    type="button"
                    variant="text"
                    onClick={() =>
                      setFieldValue("ticketQuantity", values.ticketQuantity + 1 >= 10 ? 10 : values.ticketQuantity + 1)
                    }
                  >
                    <OutlinedPlusIcon size={25} />
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Button type="submit" variant="filled" color="gray">
                    Get Tickets
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
      <div className="flex gap-4 mx-auto max-w-lg w-full rounded-md bg-gray-800 p-3 shadow-md items-center">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm">{free ? "Free" : `$${price.toFixed(2)}`}</p>
        {paymentLink && (
          <div className="border-l border-gray-700 ml-auto pl-2">
            <Link href={paymentLink} passHref>
              <a>
                <Button variant="filled" color="gray">
                  Get Tickets
                </Button>
              </a>
            </Link>
          </div>
        )}
        {free && (
          <div className="border-l border-gray-700 ml-auto pl-2">
            <Button variant="filled" color="gray" onClick={() => setShowTicketModal(true)}>
              Get Tickets
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default EventPrice;
