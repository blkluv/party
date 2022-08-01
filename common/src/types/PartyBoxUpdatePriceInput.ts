interface PartyBoxUpdatePriceInput{
  id: string;
  name: string;
  paymentLink?: string;
  paymentLinkId?: string;
  free: boolean;
  price: number;
}

export default PartyBoxUpdatePriceInput;