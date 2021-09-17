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
    cardLinks: CardLink[];

    maxTickets: number;
    visibility: "public" | "private"
    managerIds: string[];
}

interface CardLink {
    name: string;
    url: string;
}