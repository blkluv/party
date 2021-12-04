import createSMSIntent from "./createSMSIntent";
import { WEBSITE_URL } from "@config/config";
import { getFirestore, collection, addDoc, where, query, getDocs } from "@firebase/firestore";

export default async function subscribeToMailingList(phoneNumber: string) {
    const db = getFirestore();
    const subscriberRef = query(collection(db, "mailing_list"), where("phoneNumber", "==", phoneNumber));
    const subscriberDocs = await getDocs(subscriberRef);

    if (!subscriberDocs.empty) return;

    try {

        const req = await addDoc(collection(db, "mailing_list"), { phoneNumber });

        const message = `You have been subscribed to notifications from \n\n${WEBSITE_URL}\n\nIf you would like to unsubscribe, visit the link below \n\n${WEBSITE_URL}/unsubscribe/${req.id}`;

        await createSMSIntent({ recipients: [phoneNumber], message }, true);

    } catch (e) {
        console.log(e);
    }
}
