import axios from "axios";
import { PartyBoxEvent } from "@party-box/common";

const getEvent = async (id: string) => {
  const { data } = await axios.get<PartyBoxEvent>(`/api/events/${id}`);
  return data;
};

export default getEvent;
