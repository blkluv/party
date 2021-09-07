import stripe from "stripe";
import { db } from "@config/firebase";

export default async function handler(req: any, res: any) {
    const { method, body } = req;
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" });

    switch (method) {
        case "POST":
            const { price_id, ticket_quantity, event_id, customer_phone_number, customer_name } = body;

            const docRef = await db.collection("announcements").doc(event_id).collection("subscribers").add({ name: customer_name, phone_number: customer_phone_number, status: "pending", ticket_quantity });

            const doc = await docRef.get();

            const session = await stripeClient.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: price_id,
                        quantity: ticket_quantity,
                    },
                ],
                mode: 'payment',
                success_url: `${process.env.WEBSITE_URL}/tickets/${event_id}/purchase/${doc.id}`,
                cancel_url: `${process.env.WEBSITE_URL}/tickets/${event_id}`,
            });

            return res.status(200).send({ url: session.url });
    }


    return res.status(400).send({});
}
