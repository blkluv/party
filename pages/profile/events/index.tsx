import { Button } from '@components/FormComponents'
import { db } from '@config/firebase';
import React, { useRef, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import useAuth from '@utils/useAuth';
import RequireAuth from "@components/RequireAuth";
import getNewEvent from '@utils/getNewEvent';
import EventDocument from '@typedefs/EventDocument';
import Link from 'next/dist/client/link';
import { BsPlus as PlusIcon, BsTrash as TrashIcon } from "react-icons/bs";
import deleteEvent from '@utils/deleteEvent';
import Modal from '@components/Modal';
import Loading from '@components/Loading';
import Header from '@components/Header';
import { useRouter } from 'next/router';

export default function Events() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [events, eventsLoading] = useCollectionData<EventDocument>(db.collection("/events").where("hostId", "==", user?.uid ?? "none"), { idField: "id" });

    const addNewEvent = async () => {
        await db.collection("events").add(getNewEvent({ hostId: user.uid }));
    }

    const sortedEvents = events?.sort((a, b) => a.title.localeCompare(b.title));

    if (user.role !== "admin" && user.role !== "host") {
        router.push("/error/403");
    }
    if (eventsLoading || loading) return <Loading />


    return (
        <RequireAuth>
            <Header title="My Events" />
            <div className="mx-auto my-auto p-1 w-full max-w-xl flex flex-col gap-2">
                <div className="flex justify-end items-center">
                    <Button onClick={addNewEvent} variant="blank" className="border border-black rounded-full p-px group hover:border-gray-500 transition">
                        <PlusIcon className="group-hover:text-gray-500 transition w-5 h-5" />
                    </Button>
                </div>
                <div className="border border-gray-300 rounded-xl overflow-hidden divide-y divide-gray-300">
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
    const deleteRef = useRef();
    return (
        <div className="flex divide-x divide-gray-300">
            {showDelete && <Modal setOpen={setShowDelete} ref={deleteRef} size="md">

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
                <div className="flex-1 p-3 group hover:bg-blue-500 transition cursor-pointer">
                    <p className="group-hover:text-white transition">
                        {title}
                    </p>
                </div>
            </Link>
            <div className="flex justify-center items-center p-3 group hover:bg-blue-500 transition cursor-pointer" onClick={() => setShowDelete(true)}>
                <TrashIcon className="w-5 h-5 group-hover:text-white transition" />
            </div>
        </div>
    )
}
