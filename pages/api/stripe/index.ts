import stripe from "stripe";
import { db } from "@config/firebase";

export default async function handler(req: any, res: any) {
    const { method, body } = req;
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" });

    switch (method) {
        case "POST":
            const { priceId, ticketQuantity, eventId, customerPhoneNumber, customerName } = body;

            const docRef = await db.collection(`events/${eventId}/subscribers`).add({ name: customerName, phoneNumber: customerPhoneNumber, status: "pending", ticketQuantity });

            const doc = await docRef.get();

            const session = await stripeClient.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: ticketQuantity,
                    },
                ],
                mode: 'payment',
                success_url: `${process.env.WEBSITE_URL}/event/${eventId}/tickets/purchase/${doc.id}`,
                cancel_url: `${process.env.WEBSITE_URL}/event/${eventId}/tickets`,
            });

            return res.status(200).send({ url: session.url });
    }


    return res.status(400).send({});
}
