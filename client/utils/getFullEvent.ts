import axios from "axios";
import { PartyBoxEvent } from "@party-box/common";

const getFullEvent = async (id: string, token?: string) => {
  const { data } = await axios.get<PartyBoxEvent>(`/api/events/${id}/full`, {
    headers: { Authorization: `Bearer ${token ?? ""}` },
  });
  return data;
};

export default getFullEvent;
