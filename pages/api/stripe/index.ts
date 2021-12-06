import stripe from "stripe";
import { getFirestore, addDoc, collection, getDoc } from "@firebase/firestore";
import { WEBSITE_URL } from "@config/config";

export default async function handler(req: any, res: any) {
    const { method, body } = req;
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" });
    const db = getFirestore();

    try {


        switch (method) {
            case "POST":
                const { priceId, ticketQuantity, eventId, customerPhoneNumber, customerName } = body;

                const docRef = collection(db, "events", eventId, "subscribers");
                const doc = await addDoc(docRef, { name: customerName, phoneNumber: customerPhoneNumber, status: "pending", ticketQuantity, createdAt: new Date() });

                const session = await stripeClient.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [
                        {
                            price: priceId,
                            quantity: ticketQuantity,
                        },
                    ],
                    mode: 'payment',
                    success_url: `${WEBSITE_URL}/event/${eventId}/tickets/purchase/${doc.id}`,
                    cancel_url: `${WEBSITE_URL}/event/${eventId}/tickets`,
                });

                return res.status(200).send({ url: session.url });
        }


    } catch (e) {
        res.status(400).send({ error: e });
    }
    return res.status(400).send({});
}
