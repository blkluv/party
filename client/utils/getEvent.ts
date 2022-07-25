import axios from "axios";
import PartyBoxEvent from "~/types/PartyBoxEvent";

const getEvent = async (id: string, token?: string) => {
  const { data } = await axios.get<PartyBoxEvent>(`/api/events/${id}`, {
    headers: { Authorization: `Bearer ${token ?? ""}` },
  });
  return data;
};

export default getEvent;
