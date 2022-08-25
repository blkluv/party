import axios from "axios";
import { PartyBoxService } from "@party-box/common";

const getEventServices = async () => {
  const { data } = await axios.get<PartyBoxService[]>("/api/services");
  return data;
};

export default getEventServices;
