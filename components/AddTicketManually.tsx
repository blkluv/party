import { db } from '@config/firebase';
import React, { useState } from 'react'
import { Button, Input } from './FormComponents';
import { AiOutlinePlusCircle as PlusIcon, AiOutlineMinusCircle as MinusIcon } from "react-icons/ai";
import createSMSIntent from '@utils/createSMSIntent';

export interface AddTicketManuallyProps {
    eventId: string;
}

export default function AddTicketManually({ event }) {

    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const { id, title } = event;

    const incrementTickets = () => setTicketQuantity(ticketQuantity + 1);
    const decrementTickets = () => setTicketQuantity(ticketQuantity - 1 < 1 ? 1 : ticketQuantity - 1);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const newTicket = { phoneNumber, name, ticketQuantity, status: "success" }

        await db.collection(`events/${id}/subscribers`).add(newTicket);

        await createSMSIntent({ recipients: [phoneNumber], message: `Purchase successful!\n\nDetails for ${title} will be sent to you on the day of the event.\n\nIf you have any further questions, feel free to contact us.` }, true);

        setName("");
        setPhoneNumber("");
        setTicketQuantity(1);
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

            <Button>
                Submit
            </Button>
        </form>
    )
}
