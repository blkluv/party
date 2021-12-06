import { getFirestore, doc, getDoc } from "@firebase/firestore";
import twilio from 'twilio'
import { initializeApp, getApps } from "@firebase/app";
import firebaseConfig from "@config/firebase";


export default async function handler(req: any, res: any) {
    const { method, body } = req;

    const apps = getApps();

    if (apps.length === 0) {
        initializeApp(firebaseConfig);
    }

    const db = getFirestore();

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    switch (method) {
        case "POST":
            const { id } = body;

            const docRef = doc(db, "sms_intent", id);
            const docData = await getDoc(docRef);

            if (!docData.exists()) return res.status(400).send({})

            const { recipients, message, sent } = docData.data();

            if (sent) return res.status(400).send({});

            for (const recipient of recipients) {
                await client.messages
                    .create({
                        body: message,
                        to: `+1${recipient}`, // Text this number
                        from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
                    });
            }

            return res.status(200).send({});
    }

    return res.status(400).send({});
}
