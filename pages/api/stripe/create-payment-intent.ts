import stripe from "stripe";

export default async function createPaymentIntent(req: any, res: any) {
    const { method, body } = req;
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" });

    switch (method) {
        case "POST":
            const { price } = body;

            // Price in dollars
            const paymentIntent = await stripeClient.paymentIntents.create({
                amount: price * 100,
                currency: "cad",
            });

            return res.status(200).send({ clientSecret: paymentIntent.client_secret });
    }


    return res.status(400).send({});
}
