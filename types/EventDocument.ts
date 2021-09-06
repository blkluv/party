export default interface EventDocument {
    title: string;
    description: string;
    id: string | undefined;
    eventDate: Date;
    createdAt: Date;
    eventTime: string;
}