import axios from "axios";
import { CompleteEvent } from "@party-box/common";

const getFullEvent = async (id: string) => {
  const { data } = await axios.get<CompleteEvent>(`/api/events/${id}/full`);
  return data;
};

export default getFullEvent;
