import axios from "axios";
import { getFirestore, addDoc, collection } from "@firebase/firestore";

export interface SMSIntent {
    /**
     * Where every element is a phone number
     */
    recipients: string[];

    message: string;

    id?: string;
}

export default async function createSMSIntent(body: SMSIntent, consume?: boolean) {
    try {
        const db = getFirestore();
        const intent = await addDoc(collection(db, "sms_intent"), { ...body, sent: false });

        if (consume)
            await axios.post("/api/consume-sms-intent", { id: intent.id });
    } catch (e) {
        console.error("Error - Could not create/consume SMS intent")
    }
}