import { Button } from '@components/FormComponents'
import React, { useEffect, useRef, useState } from 'react'
import RequireAuth from "@components/RequireAuth";
import getNewEvent from '@utils/getNewEvent';
import EventDocument from '@typedefs/EventDocument';
import Link from 'next/link';
import { BsPlus as PlusIcon, BsTrash as TrashIcon } from "react-icons/bs";
import deleteEvent from '@utils/deleteEvent';
import { Modal } from '@components/beluga';
import Header from '@components/Header';
import { getAuth } from '@firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import LoadingScreen from '@components/LoadingScreen';
import { getFirestore, addDoc, collection, query, where, onSnapshot } from "@firebase/firestore";

export default function Events() {
    const auth = getAuth();
    const [user, loading] = useAuthState(auth);
    const db = getFirestore();
    const [events, setEvents] = useState<EventDocument[]>([]);
    const [eventsLoading, setEventsLoading] = useState(false);
    const sortedEvents = events?.sort((a, b) => a.title.localeCompare(b.title));

    const addNewEvent = async () => {
        await addDoc(collection(db, "events"), getNewEvent({ hostId: user.uid }));
    }

    useEffect(() => {
        (async () => {
            if (!user) return;
            setEventsLoading(true);
            const eventsRef = query(collection(db, "events"), where("hostId", "==", user?.uid));
            onSnapshot(eventsRef, (snapshot) => {
                const tmpEvents = [];
                snapshot.forEach((doc) => {
                    tmpEvents.push({ ...doc.data(), id: doc.id });
                });
                setEvents(tmpEvents);
            });
            setEventsLoading(false);
        })();
    })

    if (eventsLoading || loading) return <LoadingScreen />

    return (
        <RequireAuth>
            <Header title="My Events" />
            <div className="mx-auto my-auto p-1 w-full max-w-xl flex flex-col gap-2">
                <div className="flex justify-end items-center">
                    <Button onClick={addNewEvent} variant="blank" className="border border-black rounded-full p-px group hover:border-gray-500 transition">
                        <PlusIcon className="group-hover:text-gray-500 transition w-5 h-5" />
                    </Button>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden divide-y divide-gray-300 dark:divide-gray-800">
                    {sortedEvents.length ? sortedEvents?.map(({ title, id }) => <EventListItem title={title} id={id} key={id} />) : <p className="p-3">No events</p>}
                </div>
            </div>
        </RequireAuth>
    )
}

export interface EventListItemProps {
    title: string;
    id: string;
}
const EventListItem = ({ title, id }: EventListItemProps) => {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <div className="flex divide-x divide-gray-300 dark:divide-gray-800">
            {showDelete && <Modal onClose={() => setShowDelete(false)} size="md">

                <p className="text-xl mb-6">Are you sure you want to delete <span className="text-blue-500">{title}</span>?</p>

                <div className="flex items-center justify-center gap-4">
                    <Button onClick={() => {
                        setShowDelete(false);
                        deleteEvent(id);
                    }}>
                        Delete
                    </Button>
                </div>
            </Modal>}
            <Link href={`/event/${id}`}>
                <div className="flex-1 p-3 group background-hover">
                    <p className="group-hover:text-white transition">
                        {title}
                    </p>
                </div>
            </Link>
            <div className="flex justify-center items-center p-3 group background-hover" onClick={() => setShowDelete(true)}>
                <TrashIcon className="w-5 h-5 group-hover:text-white transition" />
            </div>
        </div>
    )
}
