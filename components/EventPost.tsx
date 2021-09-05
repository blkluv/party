import React, { useRef, useState } from 'react';
import { BsTrash as TrashIcon } from "react-icons/bs";
import { AiFillEdit as EditIcon, AiOutlineLoading as LoadingIcon, AiOutlineNotification as NotifyIcon } from "react-icons/ai";
import PopupContainer from './PopupContainer';
import { Button } from './FormComponents';
// import AnnouncementForm from './AnnouncementForm';
import Link from 'next/link';
import { HiOutlineInformationCircle as InfoIcon } from "react-icons/hi"
import { useCollectionData } from 'react-firebase-hooks/firestore';
// import ManageMailingListForm from './ManageMailingListForm';
import { IoTicketOutline as TicketIcon } from "react-icons/io5";
// import AddPersonWindow from './AddPersonWindow';


export default function EventPost(props: any) {
    const { title, body, created_at, event_date, id, event_time } = props;

    const [showEditWindow, setShowEditWindow] = useState(false);
    const [showDeleteWindow, setShowDeleteWindow] = useState(false);
    const [showNotifyWindow, setShowNotifyWindow] = useState(false);
    const [showAddPersonWindow, setShowAddPersonWindow] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const deleteWindowRef: any = useRef();

    const getFormattedEventTime = () => {
        if (!event_time) return "9:00 PM";
        const [hour, minute] = event_time.split(":").map((e: string) => +e);

        return `${hour % 12}:${minute.toString().padStart(2, "0")} ${hour > 12 ? "PM" : "AM"}`;
    }

    return (
        <div className="p-4 md:p-6 flex flex-col gap-3 relative w-full">
            {/* {showEditWindow && <AnnouncementForm setOpen={setShowEditWindow} initialState={props} />} */}
            {/* {showDeleteWindow && <PopupContainer setOpen={setShowDeleteWindow} passRef={deleteWindowRef}>
                <div className="flex justify-center p-2">
                    <div ref={deleteWindowRef} className="p-4 bg-white rounded-xl w-full max-w-sm">
                        <h2 className="font-thin text-xl text-center mb-6">Delete This Post</h2>
                        <p className="mb-6 font-normal text-blue-500">{title}</p>
                        <div className="flex items-center justify-center gap-4">
                            <Button onClick={deleteAnnouncement}>
                                Delete
                            </Button>
                        </div>
                        {deleteLoading && <LoadingIcon className="w-12 h-12 mx-auto fill-current text-gray-400 mt-4 animate-spin" />}
                    </div>
                </div>
            </PopupContainer>} */}
            {/* {showAddPersonWindow && <AddPersonWindow announcementId={id} setOpen={setShowAddPersonWindow} />} */}
            {/* {showNotifyWindow && <ManageMailingListForm subscribers={subscribers} setOpen={setShowNotifyWindow} />} */}
            <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                    <h2>{title}</h2>
                    <p className="font-normal"><span className="text-blue-500 font-semibold">{new Date(event_date).toDateString()}</span> at {getFormattedEventTime()}</p>
                </div>
                <p className="whitespace-pre-line text-gray-600 font-normal">{body}</p>
                {(new Date(new Date(event_date).toDateString()) >= new Date(new Date().toDateString())) && <div className="flex flex-col items-center gap-4 mt-6">
                    <div className="flex items-center gap-4 flex-1">
                        <InfoIcon className="w-9 h-9 text-gray-600" />
                        <p className="font-normal text-gray-600">
                            Purchasing a ticket places you on the guest list. If you are not on the guest list you will not be let in.
                        </p>
                    </div>
                    <Link href={`/tickets/${id}`}>
                        <div>
                            <Button className="flex gap-2 items-center">
                                <TicketIcon className="w-6 h-6" />
                                <p className="font-normal">
                                    Purchase Tickets
                                </p>
                            </Button>
                        </div>
                    </Link>
                </div>}
                <p className="font-normal text-gray-400 text-sm text-right">
                    Posted on {new Date(created_at).toDateString()}
                </p>
            </div>
        </div>
    )
}
