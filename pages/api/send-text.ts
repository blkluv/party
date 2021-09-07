import twilio from 'twilio'

export default async function handler(req: any, res: any) {
    const { method, body } = req;

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    switch (method) {
        case "POST":
            const { message, recipients } = body;

            for (const recipient of recipients) {
                await client.messages
                    .create({
                        body: message,
                        to: `+1${recipient}`, // Text this number
                        from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
                    });
            }

            return res.status(200).send({ stinky: "monkey" });
    }

    return res.status(400).send({});
}
