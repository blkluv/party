import React, { useEffect, useRef, useState } from 'react';
import { AiFillEdit as EditIcon, AiOutlineNotification as NotifyIcon, AiOutlineSave as SaveIcon, AiOutlineUnorderedList as ListIcon, AiOutlineMessage as MessageIcon } from "react-icons/ai";
import Link from 'next/link';
import { IoTicketOutline as TicketIcon } from "react-icons/io5";
import { Modal } from '@components/beluga';
import { Button, Input, Select, Switch, TextArea } from '@components/FormComponents';
import { GoFileMedia as MediaIcon } from "react-icons/go";
import UploadEventMedia from '@components/UploadEventMedia';
import dateConvert from '@utils/dateConvert';
import Header from '@components/Header';
import SearchSubscribers from '@components/SearchSubscribers';
import BroadcastSubcribers from '@components/BroadcastSubcribers';
import AddTicketManually from '@components/AddTicketManually';
import { getFirestore, doc, collection, query, where, setDoc, onSnapshot } from "@firebase/firestore";
import { getStorage, ref, getDownloadURL, listAll } from "@firebase/storage";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from '@firebase/auth';
import LoadingScreen from '@components/LoadingScreen';
import EventDocument from '@typedefs/EventDocument';

const Carousel = ({ images = [] }: { images?: string[] }) => {
    return (<div className="overflow-x-scroll lg:overflow-x-hidden py-3">
        <div className="flex gap-2 lg:flex-wrap lg:justify-center">
            {images.map((url: string) =>
                <img src={url} key={url} className="max-w-sm lg:max-w-md rounded-md shadow-md" />
            )}
        </div>
    </div>)
};

export default function Event({ id }) {
    const db = getFirestore();
    const storage = getStorage();

    const [showUploadMedia, setShowUploadMedia] = useState(false);
    const [showEditFlyer, setShowEditFlyer] = useState(false);
    const [editing, setEditing] = useState(false);
    const [showEditCards, setShowEditCards] = useState(false);
    const [editState, setEditState]: any = useState(null);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState("");
    const [showSearchSubscribers, setShowSearchSubscribers] = useState(false);
    const [showBroadcastSubscribers, setShowBroadcastSubscribers] = useState(false);
    const [showAddTickets, setShowAddTickets] = useState(false);
    const editFlyerRef = useRef();
    const editCardsRef = useRef();

    const auth = getAuth();
    const [user] = useAuthState(auth);
    const [isOwner, setIsOwner] = useState(false);
    const [event, setEvent] = useState(null);
    const [eventSubscribers, setEventSubscribers] = useState([]);
    const [eventLoading, setEventLoading] = useState(true);

    useEffect(() => {
        if (user && event) {
            setIsOwner(event?.hostId === user?.uid);
        }

        (async () => {
            if (!eventLoading) return;

            const eventRef = doc(db, "events", id);

            onSnapshot(eventRef, (snapshot) => {
                setEvent({ ...snapshot.data(), id: snapshot.id } as EventDocument);
            });

            const eventSubscribersRef = query(collection(db, "events", id, "subscribers"), where("status", "==", "success"));
            onSnapshot(eventSubscribersRef, (snapshot) => {
                const tmpSubscribers = [];
                snapshot.forEach(e => {
                    tmpSubscribers.push({ ...e.data(), id: e.id });
                });
                setEventSubscribers(tmpSubscribers);
            });

            setEventLoading(false);

        })();
    }, [user, event]);

    const getFormattedEventTime = () => {
        if (!event.eventTime) return "9:00 PM";
        const [hour, minute] = event.eventTime.split(":").map((e: string) => +e);

        return `${hour % 12}:${minute.toString().padStart(2, "0")} ${hour > 12 ? "PM" : "AM"}`;
    }

    const handleEditStateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditState({ ...editState, [name]: value });
    }

    const saveEditState = async () => {
        const docRef = doc(db, "events", id);
        await setDoc(docRef, { ...editState, eventDate: dateConvert(editState.eventDate), maxTickets: +editState.maxTickets }, { merge: true });
        setEditing(false);
    }

    const toggleCard = async (file: any) => {
        const url = getDownloadURL(ref(file));
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
        const data = await listAll(ref(storage, `events/${id}`))
        setFiles(data.items);
    }

    const submitEditFlyer = async (e: any) => {
        e.preventDefault();
        if (selectedFile === "") return;
        const url = await getDownloadURL(ref(storage, selectedFile));
        setEditState({ ...editState, flyerLink: url });
        setShowEditFlyer(false);
    }

    useEffect(() => {
        if (event)
            setEditState({ ...event, eventDate: event.eventDate.toDate().toISOString().slice(0, 10) });
    }, [event]);

    useEffect(() => {
        getFiles();
    }, [showEditCards, showEditFlyer])

    if (!event || eventLoading) return <LoadingScreen />;

    return (
        <div className="flex flex-col gap-3 relative">
            <Header title={event?.title} />
            {showSearchSubscribers && <Modal onClose={() => setShowBroadcastSubscribers(false)} size="xl">
                <SearchSubscribers subscribers={eventSubscribers} eventId={id} />
            </Modal>}
            {showBroadcastSubscribers && <Modal onClose={() => setShowBroadcastSubscribers(false)} size="xl">
                <BroadcastSubcribers subscribers={eventSubscribers} />
            </Modal>}
            {showAddTickets && <Modal onClose={() => setShowAddTickets(false)} size="xl">
                <AddTicketManually event={event} />
            </Modal>}
            {isOwner && <div className="flex justify-center gap-3 border-b border-gray-200 py-2">
                {editing ?
                    <SaveIcon className="w-7 h-7 p-1 cursor-pointer text-gray-400 hover:text-blue-500 transition" onClick={() => saveEditState()} />
                    :
                    <EditIcon className="w-7 h-7 p-1 cursor-pointer text-gray-400 hover:text-blue-500 transition" onClick={() => setEditing(!editing)} />}
                <MessageIcon className="w-7 h-7 p-1 cursor-pointer text-gray-400 hover:text-blue-500 transition" onClick={() => setShowBroadcastSubscribers(true)} />
                <ListIcon className="w-7 h-7 p-1 cursor-pointer text-gray-400 hover:text-blue-500 transition" onClick={() => setShowBroadcastSubscribers(true)} />
                <TicketIcon className="w-7 h-7 p-1 cursor-pointer text-gray-400 hover:text-blue-500 transition" onClick={() => setShowAddTickets(true)} />
                <MediaIcon className="w-7 h-7 p-1 cursor-pointer text-gray-400 hover:text-blue-500 transition" onClick={() => setShowUploadMedia(true)} />
            </div>}
            {showUploadMedia && <UploadEventMedia setOpen={setShowUploadMedia} eventId={id} />}

            {showEditFlyer && <Modal onClose={() => setShowEditFlyer(false)} size="md">
                <form onSubmit={submitEditFlyer} ref={editFlyerRef}>
                    <Select onChange={(e) => setSelectedFile(e.target.value)} value={selectedFile}>
                        <option disabled value={""}>
                            None
                        </option>
                        {files.map((file) => <option value={file} key={file.name}>
                            {file.name}
                        </option>)}
                    </Select>
                    <div className="flex justify-center mt-2">
                        <Button>
                            Change Flyer
                        </Button>
                    </div>
                </form>
            </Modal>}
            <div className="flex flex-col items-center lg:flex-row md:justify-center gap-5 p-2 sm:p-8 w-full max-w-xl lg:max-w-7xl mx-auto lg:items-start">
                <div className="flex flex-col gap-2 flex-1">
                    <img src={event?.flyerLink} className="w-full lg:max-w-xl" />
                    {editing && <Button onClick={() => setShowEditFlyer(true)}>
                        Edit Flyer
                    </Button>}
                </div>
                <div className="flex flex-col gap-2 w-full flex-1">
                    {editing && <Select onChange={handleEditStateChange} name="visibility">
                        <option value="private">
                            Private
                        </option>
                        <option value="public">
                            Public
                        </option>
                    </Select>}
                    <div className="grid gap-2">
                        {editing ? <Input value={editState.title} onChange={handleEditStateChange} name="title" /> : <h2>{event.title}</h2>}
                        {editing ? <Input type="date" value={editState.eventDate} onChange={handleEditStateChange} name="eventDate" /> : <p className="font-normal"><span className="text-blue-500 font-semibold">{event.eventDate.toDate().toDateString()}</span> at {getFormattedEventTime()}</p>}
                        {editing && <Input type="time" value={editState.eventTime} onChange={handleEditStateChange} name="eventTime" />}
                    </div>

                    {editing ? <TextArea value={editState.description} onChange={handleEditStateChange} name="description" /> : <p className="whitespace-pre-line text-gray-600 font-normal">{event.description}</p>}

                    {!editing && event.eventDate.toDate() >= new Date(new Date().toDateString()) && <div className="flex flex-col items-center gap-4 mt-6">
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
                    {editing &&
                        <Input onChange={handleEditStateChange} value={editState.priceId} name="priceId" placeholder="Price ID" />}
                    {editing &&
                        <Input onChange={handleEditStateChange} value={editState.maxTickets} name="maxTickets" placeholder="Maximum Tickets" type="number" />}
                    <Carousel images={event.cardLinks.map(({ url }) => url)} />
                    {showEditCards && <Modal onClose={() => setShowEditCards(false)} size="md">
                        <div className="flex flex-col gap-2">
                            {files.map((file) => <div key={file} className="flex items-center gap-4">
                                <Switch value={editState.cardLinks.find(({ name }) => name === file.name)} onClick={() => toggleCard(file)} />
                                <p>{file.name}</p>
                            </div>)}
                        </div>
                    </Modal>}
                    {editing && <Button onClick={() => setShowEditCards(true)}>
                        Edit Cards
                    </Button>}
                    <p className="font-normal text-gray-400 text-sm text-right">
                        Posted on {event.createdAt.toDate().toDateString()}
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