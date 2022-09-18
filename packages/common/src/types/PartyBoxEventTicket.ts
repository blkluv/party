import PartyBoxEvent from "./PartyBoxEvent";

type Status =
  | "canceled"
  | "processing"
  | "requires_action"
  | "requires_capture"
  | "requires_confirmation"
  | "requires_payment_method"
  | "succeeded";

interface PartyBoxEventTicket {
  status: Status;
  customerPhoneNumber: string;
  customerName: string;
  ticketQuantity: number;
  event: PartyBoxEvent;
  used: boolean;
  receiptUrl: string;
  eventId: string;
  stripeChargeId: string;
  stripeSessionId: string;
  timestamp: string;
  customerEmail: string;
  id: string;
  purchasedAt: string;
}

export default PartyBoxEventTicket;
