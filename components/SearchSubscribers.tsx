import { db } from '@config/firebase';
import MailingListSubscriber from '@typedefs/MailingListSubscriber'
import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import { Button, Input } from './FormComponents';
import { BsTrash as TrashIcon } from "react-icons/bs";

export interface SearchSubscribersProps {
    subscribers: MailingListSubscriber[];
    eventId: string;
}

export default function SearchSubscribers({ subscribers, eventId }: SearchSubscribersProps) {
    const [query, setQuery] = useState("");

    const queriedSubscribers = subscribers.filter(({ name, phoneNumber }) => name.toLowerCase().includes(query.toLowerCase()) || phoneNumber.includes(query));

    return (
        <div>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
            <div className="grid grid-cols-9 my-4">
                <p className="font-medium">
                    Tickets
                </p>
                <p className="col-span-4 font-medium text-center">
                    Name
                </p>
                <p className="col-span-3 font-medium text-center">
                    Phone Number
                </p>
            </div>
            <div className="divide-y divide-gray-200">
                {queriedSubscribers.length
                    ? queriedSubscribers.map((subscriber) => <SubscriberRow key={subscriber.id} eventId={eventId} subscriber={subscriber} />)
                    : <p className="text-center">No results</p>}
            </div>
        </div>
    )
};

const SubscriberRow = ({ eventId, subscriber }: { eventId: string, subscriber: MailingListSubscriber }) => {
    const { id, name, phoneNumber, ticketQuantity } = subscriber;
    
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const deleteSubscriber = async () => {
        await db.doc(`events/${eventId}/subscribers/${id}`).delete();
    }

    return (
        <div className="py-1 grid grid-cols-9" >
            <p>
                {ticketQuantity}
            </p>
            <p className="col-span-4 text-center">
                {name}
            </p>
            <p className="col-span-3 text-center">
                <NumberFormat displayType="text" value={phoneNumber} format="###-###-####" />
            </p>
            <Button variant="blank">
                <TrashIcon className="w-4 h-4 transition hover:text-gray-500" onClick={deleteSubscriber} />
            </Button>
        </div >
    )
}
