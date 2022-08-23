import { PartyBoxHost, PartyBoxCreateHostInput } from "@party-box/common";
import axios from "axios";

const createHost = async (newHostData: PartyBoxCreateHostInput, image: File) => {
  try {
    const { data: createdHost } = await axios.post<PartyBoxHost>("/api/hosts/create");

    const {
      data: { uploadUrl, downloadUrl },
    } = await axios.post<{ downloadUrl: string; uploadUrl: string }>(`/api/hosts/${createdHost.id}/upload`, {
      name: image.name,
    });

    await axios.put(uploadUrl, image);

    const { data: updatedHost } = await axios.post<PartyBoxHost>(`/api/hosts/${createdHost.id}`, {
      imageUrl: downloadUrl,
    });

    return updatedHost;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default createHost;
