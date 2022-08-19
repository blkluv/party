import { PartyBoxHost,PartyBoxCreateHostInput } from "@party-box/common";
import axios from "axios";

const createHost = async (newHostData: PartyBoxCreateHostInput, token: string) => {
  try {
    const { data } = await axios.post<PartyBoxHost>("/api/host/create", newHostData, { headers: { Authorization: `Bearer ${token}` } });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default createHost;