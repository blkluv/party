import { db } from "@config/firebase";
import axios from "axios";

export interface SMSIntent {
    /**
     * Where every element is a phone number
     */
    recipients: string[];

    message: string;

    id?: string;
}

export default async function createSMSIntent(body: SMSIntent, consume: boolean) {
    try {
        const intent = await db.collection("sms_intent").add(body);

        await axios.post("/api/consume-sms-intent", { id: intent.id });
    } catch (e) {
        console.error("Error - Could not create/consume SMS intent")
    }
}