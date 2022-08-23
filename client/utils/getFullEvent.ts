import axios from "axios";
import { PartyBoxEvent } from "@party-box/common";

const getFullEvent = async (id: string) => {
  const { data } = await axios.get<PartyBoxEvent>(`/api/events/${id}/full`);
  return data;
};

export default getFullEvent;
