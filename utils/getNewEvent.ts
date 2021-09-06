import EventDocument from "@typedefs/EventDocument";

export default function getNewEvent(overrides?: any): EventDocument {
    return {
        title: "New Event",
        description: "This is the description for my new event",
        eventDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        ...overrides
    }
}
