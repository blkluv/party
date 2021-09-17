import { db } from '@config/firebase';
import React, { useState } from 'react'
import { Button, Input } from './FormComponents';
import { AiOutlinePlusCircle as PlusIcon, AiOutlineMinusCircle as MinusIcon } from "react-icons/ai";
import createSMSIntent from '@utils/createSMSIntent';
import EventDocument from '@typedefs/EventDocument';
import subscribeToMailingList from '@utils/subscribeToMailingList';
import createPurchaseReceipt from '@utils/createPurchaseReceipt';

export interface AddTicketManuallyProps {
    event: EventDocument;
}

export default function AddTicketManually({ event }: AddTicketManuallyProps) {

    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const { id, title } = event;

    const incrementTickets = () => setTicketQuantity(ticketQuantity + 1);
    const decrementTickets = () => setTicketQuantity(ticketQuantity - 1 < 1 ? 1 : ticketQuantity - 1);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setLoading(true);

        const newTicket = { phoneNumber, name, ticketQuantity, status: "success", createdAt: new Date() }

        await db.collection(`events/${id}/subscribers`).add(newTicket);

        await subscribeToMailingList(phoneNumber);

        await createPurchaseReceipt(phoneNumber, title);

        setName("");
        setPhoneNumber("");
        setTicketQuantity(1);

        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input value={name} onChange={(e: any) => setName(e.target.value)} type="text" placeholder="Name" />
            <Input value={phoneNumber} onChange={(e: any) => setPhoneNumber(e.target.value)} type="tel" placeholder="Phone Number" />
            <div>
                <p className="mb-2">Ticket Quantity</p>
                <div className="flex gap-2 items-center">
                    <MinusIcon className="w-6 h-6 hover:text-gray-500 transition cursor-pointer" onClick={decrementTickets} />
                    <p>{ticketQuantity}</p>
                    <PlusIcon className="w-6 h-6 hover:text-gray-500 transition cursor-pointer" onClick={incrementTickets} />
                </div>
            </div>

            <Button disabled={loading}>
                Submit
            </Button>
        </form>
    )
}
