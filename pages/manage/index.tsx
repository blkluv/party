import { Button, Input } from '@components/FormComponents'
import { db, storage } from '@config/firebase';
import React, { useState } from 'react'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import useUser from '../../utils/useUser';
import RequireAuth from "@components/RequireAuth";
import getNewEvent from '@utils/getNewEvent';
import EventPost from '@components/EventPost';
import EventDocument from '@typedefs/EventDocument';

/**
 * This is the page where a user can post their new parties and send out notifications for them
 * @returns 
 */
export default function Manage() {
    const { user } = useUser();
    const path = `/pages/${user?.uid ?? "none"}`;
    const [page, pageLoading] = useDocumentData(db.doc(path));
    const [events, eventsLoading] = useCollectionData<EventDocument>(db.collection(path + "/events"), { idField: "id" });
    const [file, setFile] = useState(null)

    const addNewEvent = async () => {
        await db.collection(path + "/events").add(getNewEvent());
    }

    const updatePageData = async () => {
        await db.doc(path).set({ name: "stinky" });
    }

    const uploadData = async () => {
        // console.log()
        if (file === null) return;

        storage.ref(`${user.uid}/${file.name}`).put(file);
    }

    return (
        <RequireAuth>
            <Button onClick={addNewEvent}>
                New Event
            </Button>
            <Button onClick={updatePageData}>
                update Data
            </Button>
            <Button onClick={uploadData}>
                Upload
            </Button>
            <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <div>
                {!eventsLoading && events.map((event) => <EventPost {...event} key={event.id} />)}
            </div>
        </RequireAuth>
    )
}
