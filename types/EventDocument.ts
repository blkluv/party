export default interface EventDocument {
    id?: string;

    title: string;
    description: string;

    eventDate: any;
    createdAt: any;
    eventTime: string;

    hostId: string;
    priceId: string;
    locationId: string;

    flyerLink: string;
    cardLinks: string[];

    maxTickets: number;
    visibility: "public" | "private"
}