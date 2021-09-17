import { db } from '@config/firebase';
import MailingListSubscriber from '@typedefs/MailingListSubscriber'
import React, { useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import { Button, Input } from './FormComponents';
import { BsTrash as TrashIcon } from "react-icons/bs";
import Modal from './Modal';

export interface SearchSubscribersProps {
    subscribers: MailingListSubscriber[];
    eventId: string;
}

export default function SearchSubscribers({ subscribers, eventId }: SearchSubscribersProps) {
    const [query, setQuery] = useState("");

    const queriedSubscribers = subscribers.filter(({ name, phoneNumber }) => name.toLowerCase().includes(query.toLowerCase()) || phoneNumber.includes(query)).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    const totalTickets = queriedSubscribers.map(e => e.ticketQuantity).reduce((a, b) => a + b, 0);

    return (
        <div>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
            <p className="text-center my-2">{totalTickets} Total Ticket{totalTickets !== 1 && "s"}</p>
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
    const deleteRef = useRef();

    const deleteSubscriber = async () => {
        await db.doc(`events/${eventId}/subscribers/${id}`).delete();
    }

    return (
        <div className="py-1 grid grid-cols-9" >
            {showConfirmDelete && <Modal setOpen={setShowConfirmDelete} ref={deleteRef}>
                <Button onClick={deleteSubscriber}>
                    Delete {name}
                </Button>
            </Modal>}
            <p>
                {ticketQuantity}
            </p>
            <p className="col-span-4 text-center capitalize">
                {name}
            </p>
            <p className="col-span-3 text-center">
                <NumberFormat displayType="text" value={phoneNumber} format="###-###-####" />
            </p>
            <Button variant="blank">
                <TrashIcon className="w-4 h-4 transition hover:text-gray-500 mx-auto" onClick={() => setShowConfirmDelete(true)} />
            </Button>
        </div >
    )
}
