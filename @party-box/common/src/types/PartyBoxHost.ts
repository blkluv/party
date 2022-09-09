import PartyBoxEvent from "./PartyBoxEvent";

interface PartyBoxHost {
  id: number;
  name: string;
  description: string;
  imageUrl: string;

  // UserID of the user that created this host
  createdBy: string;

  events?: PartyBoxEvent[];
}

export default PartyBoxHost;
