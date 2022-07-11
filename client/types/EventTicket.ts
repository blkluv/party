import PartyBoxEvent from "./PartyBoxEvent";

interface EventTicket {
  status: "succeeded" | "failed" | "pending";
  customerPhoneNumber: string;
  customerName: string;
  ticketQuantity: number;
  event: PartyBoxEvent;
  used: boolean;
  receiptUrl: string;
  eventId: string;
  stripeChargeId: string;
  timestamp: string;
  customerEmail: string;
  id: string;
}

export default EventTicket;
