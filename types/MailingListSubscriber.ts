export default interface MailingListSubscriber {
    name: string;
    phone_number: string;
    id?: string;
    ticket_quantity?: number;
}