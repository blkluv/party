import Loading from '@components/Loading';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { AiFillEdit as EditIcon, AiOutlineLoading as LoadingIcon, AiOutlineNotification as NotifyIcon, AiOutlineSave as SaveIcon, AiOutlineUnorderedList as ListIcon, AiOutlineMessage as MessageIcon } from "react-icons/ai";
import Link from 'next/link';
import { IoTicketOutline as TicketIcon } from "react-icons/io5";
import useAuth from '@utils/useAuth';
import { db, storage } from '@config/firebase';
import Modal from '@components/Modal';
import { Button, Input, Select, Switch, TextArea } from '@components/FormComponents';
import { GoFileMedia as MediaIcon } from "react-icons/go";
import UploadEventMedia from '@components/UploadEventMedia';
import dateConvert from '@utils/dateConvert';

const BusinessCards = ({ images = [] }: { images?: string[] }) => {
    return (<div className="overflow-x-scroll lg:overflow-hidden py-3">
        <div className="lg:hidden flex gap-2" style={{ width: `${20 * images.length}rem` }}>
            {images.map((url: string) =>
                <img src={url} key={url} className="w-80 rounded-md shadow-md" />
            )}
        </div>
        <div className="hidden lg:grid gap-2 grid-cols-1 xl:grid-cols-2 grid-flow-row">
            {images.map((url: string) =>
                <img src={url} key={url} className="w-80 rounded-md shadow-md mx-auto" />
            )}
        </div>
    </div>)
};

export default function Event({ id }) {
    const [event, eventLoading] = useDocumentData(db.doc(`/events/${id}`));
    const [showUploadMedia, setShowUploadMedia] = useState(false);
    const [showEditFlyer, setShowEditFlyer] = useState(false);
    const [editing, setEditing] = useState(false);
    const [showEditCards, setShowEditCards] = useState(false);
    const [editState, setEditState]: any = useState(null);
    const editFlyerRef: any = useRef();
    const editCardsRef: any = useRef();
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const { user } = useAuth();
    const isOwner = event?.hostId === user?.uid;

    const getFormattedEventTime = () => {
        if (!event.eventTime) return "9:00 PM";
        const [hour, minute] = event.eventTime.split(":").map((e: string) => +e);

        return `${hour % 12}:${minute.toString().padStart(2, "0")} ${hour > 12 ? "PM" : "AM"}`;
    }

    const handleEditStateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditState({ ...editState, [name]: value });
    }

    const saveEditState = async () => {
        await db.doc(`/events/${id}`).set({ ...editState, eventDate: dateConvert(editState.eventDate) }, { merge: true });
        setEditing(false);
    }

    const toggleCard = async (file: any) => {
        const url = await storage.refFromURL(file).getDownloadURL();
        const containsCard = editState.cardLinks.find(({ name }) => name === file.name);

        if (containsCard) {
            // Remove Card
            setEditState({ ...editState, cardLinks: editState.cardLinks.filter(({ name }) => name !== file.name) });
        } else {
            // Add Card
            setEditState({ ...editState, cardLinks: [...editState.cardLinks, { name: file.name, url }] });
        }
    }

    const getFiles = async () => {
        const data = await storage.ref(`events/${id}`).listAll();
        setFiles(data.items);
    }

    const submitEditFlyer = async (e: any) => {
        e.preventDefault();
        const url = await storage.refFromURL(selectedFile).getDownloadURL();
        setEditState({ ...editState, flyerLink: url });
        setShowEditFlyer(false);
    }

    useEffect(() => {
        if (event)
            setEditState({ ...event, eventDate: event.eventDate.toDate().toISOString().slice(0, 10) });
    }, [event]);

    useEffect(() => {
        getFiles();
    }, [showEditCards])

    if (eventLoading) return <Loading />;

    return (
        <div className="flex flex-col gap-3 relative">
            {isOwner && <div className="flex justify-center gap-3 border-b border-gray-200 py-2">
                <EditIcon className="w-7 h-7 p-1 cursor-pointer text-gray-400 hover:text-blue-500 transition" onClick={() => setEditing(!editing)} />
                <MessageIcon className="w-7 h-7 p-1 cursor-pointer text-gray-400 hover:text-blue-500 transition" />
                <ListIcon className="w-7 h-7 p-1 cursor-pointer text-gray-400 hover:text-blue-500 transition" />
                <TicketIcon className="w-7 h-7 p-1 cursor-pointer text-gray-400 hover:text-blue-500 transition" />
                {editing && <SaveIcon className="w-7 h-7 p-1 cursor-pointer text-gray-400 hover:text-blue-500 transition" onClick={() => saveEditState()} />}
                <MediaIcon className="w-7 h-7 p-1 cursor-pointer text-gray-400 hover:text-blue-500 transition" onClick={() => setShowUploadMedia(true)} />
            </div>}
            {showUploadMedia && <UploadEventMedia setOpen={setShowUploadMedia} eventId={id} />}

            {showEditFlyer && <Modal setOpen={setShowEditFlyer} ref={editFlyerRef}>
                <form onSubmit={submitEditFlyer} ref={editFlyerRef}>
                    <Select onChange={(e) => setSelectedFile(e.target.value)} value={selectedFile}>
                        {files.map((file) => <option value={file}>
                            {file.name}
                        </option>)}
                    </Select>
                    <Button>
                        Change Flyer
                    </Button>
                </form>
            </Modal>}
            <div className="flex flex-col items-center lg:flex-row md:justify-center gap-5 p-2 w-full max-w-xl lg:max-w-7xl mx-auto lg:items-start">
                <div className="flex flex-col gap-2 flex-1">
                    <img src={event.flyerLink} className="w-full lg:max-w-xl" />
                    {editing && <Button onClick={() => setShowEditFlyer(true)}>
                        Edit Flyer
                    </Button>}
                </div>
                <div className="flex flex-col gap-2 w-full flex-1">
                    <div className="grid gap-2">
                        {editing ? <Input value={editState.title} onChange={handleEditStateChange} name="title" /> : <h2>{event.title}</h2>}
                        {editing ? <Input type="date" value={editState.eventDate} onChange={handleEditStateChange} name="eventDate" /> : <p className="font-normal"><span className="text-blue-500 font-semibold">{event.eventDate.toDate().toDateString()}</span> at {getFormattedEventTime()}</p>}
                    </div>

                    {editing ? <TextArea value={editState.description} onChange={handleEditStateChange} name="description" /> : <p className="whitespace-pre-line text-gray-600 font-normal">{event.description}</p>}

                    {event.eventDate.toDate() >= new Date() && <div className="flex flex-col items-center gap-4 mt-6">
                        <Link href={`/event/${id}/tickets`}>
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
                    <BusinessCards images={event.cardLinks.map(({ url }) => url)} />
                    {showEditCards && <Modal setOpen={setShowEditCards} ref={editCardsRef}>
                        <div className="flex flex-col">
                            {files.map((file) => <div key={file}>
                                <Switch value={editState.cardLinks.find(({ name }) => name === file.name)} onClick={() => toggleCard(file)} />
                                <p>{file.name}</p>
                            </div>)}
                        </div>
                    </Modal>}
                    {editing && <Button onClick={() => setShowEditCards(true)}>
                        Edit Cards
                    </Button>}
                    <p className="font-normal text-gray-400 text-sm text-right">
                        Posted on {new Date(event.createdAt).toDateString()}
                    </p>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context: any) {
    const { eventId: id = "" } = context.params;
    return {
        props: {
            id
        }
    }
}