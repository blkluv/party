import { db } from '@config/firebase';
import twilio from 'twilio'

export default async function handler(req: any, res: any) {
    const { method, body } = req;

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    switch (method) {
        case "POST":
            const { id } = body;

            const doc = await db.doc(`sms_intent/${id}`).get();

            if (!doc.exists) return res.status(400).send({})

            const { recipients, message, sent } = doc.data();

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
