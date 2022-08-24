import axios from "axios";
import { PartyBoxEventNotification } from "@party-box/common";

const getEventNotifications = async (id: string) => {
  const { data } = await axios.get<PartyBoxEventNotification[]>(`/api/events/${id}/notifications`);

  return data;
};

export default getEventNotifications;
