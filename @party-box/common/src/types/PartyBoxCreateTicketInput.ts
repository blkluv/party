interface PartyBoxCreateTicketInput {
  eventId: number;
  stripeSessionId: string;
  stripeChargeId: string;
  receiptUrl: string;
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  purchasedAt: string;
  ticketQuantity: number;
  used: boolean;
  userId?: string;
}

export default PartyBoxCreateTicketInput;
