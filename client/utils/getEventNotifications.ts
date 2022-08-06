import axios from "axios";
import { PartyBoxEventNotification } from "@party-box/common";

const getEventNotifications = async (id: string, token?: string) => {
  const { data } = await axios.get<PartyBoxEventNotification[]>(`/api/events/${id}/notifications`, {
    headers: { Authorization: `Bearer ${token ?? ""}` },
  });

  return data;
};

export default getEventNotifications;
