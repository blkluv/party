interface PartyBoxEventPrice {
  id: string;
  name: string;
  paymentLink: string | null;
  paymentLinkId: string | null;
  free?: boolean;
  price: number;
}

export default PartyBoxEventPrice;
