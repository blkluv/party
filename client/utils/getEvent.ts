import axios from "axios";
import { PartyBoxEvent } from "@party-box/common";

const getEvent = async (id: string, token?: string) => {
  const { data } = await axios.get<PartyBoxEvent>(`/api/events/${id}`, {
    headers: { Authorization: `Bearer ${token ?? ""}` },
  });
  return data;
};

export default getEvent;
