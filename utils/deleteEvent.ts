import { db, storage } from "@config/firebase";

export default async function deleteEvent(id: string) {
    try {
        await db.doc(`events/${id}`).delete();
        await storage.ref(`events/${id}`).delete();
    } catch (e) {

    }
}