import React from 'react'
import { useCollectionData, useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { db } from '@config/firebase';
import Loading from '@components/Loading';
import { useRouter } from 'next/router';
import { Button, Input } from '@components/FormComponents';
import axios from 'axios';
import { useState } from 'react';
import { AiOutlinePlusCircle as PlusIcon, AiOutlineMinusCircle as MinusIcon } from "react-icons/ai";
import MailingListSubscriber from '@typedefs/MailingListSubscriber';

export default function TicketPurchase({ id }) {
    const router = useRouter();

    const [event, eventLoading] = useDocumentDataOnce(db.doc(`events/${id}`), { idField: "id" });
    const [subscribers, subscribersLoading] = useCollectionData<MailingListSubscriber>(db.collection(`/events/${id}/subscribers`).where("status", "==", "success"));

    const [form, setForm] = useState({ name: "", phoneNumber: "" });
    const [errors, setErrors] = useState({ name: "", phoneNumber: "" });
    const [ticketQuantity, setTicketQuantity] = useState(1);

    const tickets_sold = subscribers?.map(({ ticketQuantity }) => ticketQuantity ?? 1).reduce((a, b) => a + b, 0);
    const ticketCapReached = tickets_sold >= event?.maxTickets;

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        if (name === "name") {
            if (value === "") {
                setErrors({ ...errors, name: "Name must be defined" });
            } else {
                setErrors({ ...errors, name: "" })
            }
        } else if (name === "phoneNumber") {
            if (value === "" || value.length < 10) {
                setErrors({ ...errors, phoneNumber: "Phone number is invalid" });
            } else {
                setErrors({ ...errors, phoneNumber: "" })
            }

            if (value.length > 10) return;
        }

        setForm({ ...form, [name]: value });
    }


    const handleTicketIncrease = () => {
        setTicketQuantity(ticketQuantity + 1);
    }
    const handleTicketDecrease = () => {
        if (ticketQuantity - 1 < 1) return;
        setTicketQuantity(ticketQuantity - 1);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (Object.values(form).find((e => e.length === 0)))
            return;
        if (Object.values(errors).find((e => e.length)))
            return;

        try {
            const { data } = await axios.post("/api/stripe", { eventId: event.id, priceId: event.priceId, ticketQuantity: ticketQuantity, customerPhoneNumber: form.phoneNumber, customerName: form.name })

            router.push(data.url);
        } catch (e) {

        }
    }

    if (!id || (!eventLoading && !event)) {
        router.push("/error/404");
        return <Loading />
    }

    if (eventLoading || subscribersLoading) return <Loading />

    return (
        <div className="flex-1 flex justify-center items-center">
            <div className="bg-white rounded-xl p-3 sm:p-6 w-screen max-w-lg border border-gray-200">
                {!ticketCapReached && <div>
                    <h2>{event?.title} Tickets</h2>
                    <h3 className="font-normal text-lg text-gray-500">Customer Information</h3>
                    <form onSubmit={handleSubmit} className="grid gap-6 mt-6">
                        <div className="grid gap-3">
                            <div>
                                <p className="font-normal">Name</p>
                                <Input onChange={handleChange} name="name" type="text" value={form.name} showError={errors.name.length > 0} />
                            </div>
                            <div>
                                <p className="font-normal">Phone Number</p>
                                <Input onChange={handleChange} name="phoneNumber" type="tel" value={form.phoneNumber} showError={errors.phoneNumber.length > 0} />
                            </div>
                            <div>
                                <p className="font-normal">Ticket Quantity</p>
                                <div className="flex gap-3 items-center mt-3">
                                    <Button onClick={handleTicketDecrease} variant="blank" className="hover:text-blue-500 transition" >
                                        <MinusIcon className="h-7 w-7" />
                                    </Button>
                                    <p className="font-normal text-xl">{ticketQuantity}</p>
                                    <Button onClick={handleTicketIncrease} variant="blank" className="hover:text-blue-500 transition" >
                                        <PlusIcon className="h-7 w-7" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <Button type="submit" variant="blank" className="text-white bg-blue-500 rounded-lg text-lg flex gap-6 items-center justify-center py-2" disabled={Object.values(errors).find((e: any) => e.length) ? true : false}>
                            Pay with Stripe
                        </Button>
                    </form>
                    <p className="font-normal text-sm text-gray-500 mt-5">This will be used to subscribe you to our SMS list so that we can send you details about the event.</p>
                </div>}
                {ticketCapReached && <div>
                    <h2>Sold out</h2>
                    <p className="font-normal">
                        We have sold out of tickets for this event
                    </p>
                </div>}
            </div>
        </div >
    )
}

export async function getServerSideProps(context: any) {
    const { eventId: id } = context.params;
    return {
        props: {
            id
        }
    }
}
