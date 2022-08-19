import { PartyBoxHost, PartyBoxCreateHostInput } from "@party-box/common";
import axios from "axios";

const createHost = async (newHostData: PartyBoxCreateHostInput, image: File, token: string) => {
  try {
    const { data: createdHost } = await axios.post<PartyBoxHost>("/api/hosts/create", newHostData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const {
      data: { uploadUrl, downloadUrl },
    } = await axios.post<{ downloadUrl: string; uploadUrl: string }>(
      `/api/hosts/${createdHost.id}/upload`,
      { name: image.name },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await axios.put(uploadUrl, image);

    const { data: updatedHost } = await axios.post<PartyBoxHost>(
      `/api/hosts/${createdHost.id}`,
      { imageUrl: downloadUrl },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return updatedHost;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default createHost;
