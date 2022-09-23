import axios from "axios";
import { PartyBoxEvent, PartyBoxEventNotification, PartyBoxEventPrice } from "@party-box/common";

type T = PartyBoxEvent & { notifications: PartyBoxEventNotification[]; prices: PartyBoxEventPrice[] };
const getFullEvent = async (id: string) => {
  const { data } = await axios.get<T>(`/api/events/${id}/full`);
  return data;
};

export default getFullEvent;
