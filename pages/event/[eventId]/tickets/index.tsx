import React, { useEffect } from 'react'
import { useRouter } from 'next/router';
import { Button, Input, Switch } from '@components/beluga';
import axios from 'axios';
import { useState } from 'react';
import { AiOutlinePlusCircle as PlusIcon, AiOutlineMinusCircle as MinusIcon } from "react-icons/ai";
import subscribeToMailingList from "@utils/subscribeToMailingList";
import { getFirestore, doc, getDoc, query, collection, where, onSnapshot } from "@firebase/firestore";
import LoadingScreen from '@components/LoadingScreen';

export default function TicketPurchase({ id }) {
    const router = useRouter();
    const db = getFirestore();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subscribers, setSubscribers] = useState([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const eventRef = doc(db, "events", id);
            const eventDoc = await getDoc(eventRef);
            setEvent({ ...eventDoc.data(), id: eventDoc.id });

            const subscribersQuery = query(collection(db, "events", id, "subscribers"), where("status", "==", "success"));
            onSnapshot(subscribersQuery, (snapshot) => {
                const tmpDocs = [];
                snapshot.forEach(doc => {
                    tmpDocs.push({ ...doc.data(), id: doc.id });
                });
                setSubscribers(tmpDocs);
            });


            setLoading(false);
        })()
    }, [db, id]);

    const [form, setForm] = useState({ name: "", phoneNumber: "" });
    const [errors, setErrors] = useState({ name: "", phoneNumber: "" });
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [subscribe, setSubscribe] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    const tickets_sold = subscribers?.map(({ ticketQuantity }) => ticketQuantity ?? 1).reduce((a, b) => a + b, 0);
    const ticketCapReached = tickets_sold >= event?.maxTickets;

    // Looks for an empty value in the form object or a filled value in errors
    const shouldBlockSubmit = (Object.values(errors).filter((e: any) => e.length > 0).length || Object.values(form).filter(e => e.length === 0).length) ? true : false;

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
        if (Object.values(errors).find((e => e.length !== 0)))
            return;

        try {

            setSubmitLoading(true);
            const { data } = await axios.post("/api/stripe", { eventId: event.id, priceId: event.priceId, ticketQuantity, customerPhoneNumber: form.phoneNumber, customerName: form.name })

            if (subscribe)
                await subscribeToMailingList(form.phoneNumber);


            setSubmitLoading(false);

            await router.push(data.url);
            console.log("here")
        } catch (e) {

        }
    }

    if (!id || (!loading && !event)) {
        router.push("/error/404");
        return <LoadingScreen />
    }

    if (loading) return <LoadingScreen />

    return (
        <div className="flex justify-center items-center p-2 flex-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-3 sm:p-6 w-screen max-w-lg shadow-center-md">
                {!ticketCapReached && <div>
                    <h2>{event?.title} Tickets</h2>
                    <h3 className="font-normal text-lg text-gray-500">Customer Information</h3>
                    <form onSubmit={handleSubmit} className="grid gap-6 mt-6">
                        <div className="grid gap-3">
                            <div>
                                <p className="font-normal">Name</p>
                                <Input onChange={handleChange} name="name" type="text" value={form.name} minLength={1} />
                            </div>
                            <div>
                                <p className="font-normal">Phone Number</p>
                                <Input onChange={handleChange} name="phoneNumber" type="tel" value={form.phoneNumber} minLength={10} maxLength={10} />
                            </div>
                            <div>
                                <p className="font-normal">Ticket Quantity</p>
                                <div className="flex gap-3 items-center mt-3">
                                    <Button onClick={handleTicketDecrease} variant="blank" type="button" className="hover:text-blue-500 transition" >
                                        <MinusIcon className="h-7 w-7" />
                                    </Button>
                                    <p className="font-normal text-xl">{ticketQuantity}</p>
                                    <Button onClick={handleTicketIncrease} variant="blank" type="button" className="hover:text-blue-500 transition" >
                                        <PlusIcon className="h-7 w-7" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="font-normal">Get notified about future events</p>
                                <Switch onClick={() => setSubscribe(!subscribe)} value={subscribe} />
                            </div>
                        </div>
                        <Button type="submit" variant="blank" className="text-white bg-blue-500 rounded-lg text-lg flex gap-6 items-center justify-center py-2" disabled={shouldBlockSubmit || submitLoading}>
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
