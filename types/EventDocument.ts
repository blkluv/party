export default interface EventDocument {
    title: string;
    description: string;
    id: string | undefined;
    eventDate: any;
    createdAt: any;
    eventTime: string;
    hostId: string;
    priceId: string;
}