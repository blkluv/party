import { getFirestore, doc, deleteDoc } from "@firebase/firestore";
import { getStorage, ref, deleteObject, listAll } from "@firebase/storage";

export default async function deleteEvent(id: string) {
    const db = getFirestore();
    const storage = getStorage();
    try {
        const docRef = doc(db, "events", id);
        await deleteDoc(docRef);
        const storageRef = ref(storage, `events/${id}`);
        
        const files = await listAll(storageRef);

        for (const item of files.items) {
            await deleteObject(item);
        }

    } catch (e) {

    }
}