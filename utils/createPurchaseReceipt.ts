import createSMSIntent from "./createSMSIntent";

/**
 * Sends a preset message confirming the ticket purchase of a customer.
 * @param phoneNumber Customer's phone number
 * @param eventTitle Title of event
 */
export default async function createPurchaseReceipt(phoneNumber: string, eventTitle: string) {
    try {
        await createSMSIntent({ recipients: [phoneNumber], message: `Purchase successful!\n\nDetails for ${eventTitle} will be sent to you on the day of the event.\n\nIf you have any further questions, feel free to contact us.` }, true);
    } catch (e) {
        console.error(e);
    }
}
