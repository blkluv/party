import { db } from "@config/firebase";
import createSMSIntent from "./createSMSIntent";

export default async function subscribeToMailingList(phoneNumber: string) {
    const subscriberRef = await db.collection("mailing_list").where("phoneNumber", "==", phoneNumber).get();

    if (!subscriberRef.empty) return;

    try {

        const req = await db.collection("mailing_list").add({ phoneNumber });

        const data = await req.get();

        const message = `You have been subscribed to notifications from \n\n${process.env.WEBSITE_URL} 🐗 \n\nIf you would like to unsubscribe, visit the link below \n\n${process.env.WEBSITE_URL}/unsubscribe/${data.id}`;

        await createSMSIntent({ recipients: [phoneNumber], message }, true);

    } catch (e) {

    }
}
