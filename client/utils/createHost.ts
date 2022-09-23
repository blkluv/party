import { PartyBoxHost, PartyBoxCreateHostInput } from "@party-box/common";
import axios from "axios";
import uploadMedia from "./uploadMedia";

const createHost = async (newHostData: PartyBoxCreateHostInput, image: File) => {
  try {
    const { data: createdHost } = await axios.post<PartyBoxHost>("/api/hosts/create", newHostData);

    const {
      data: { uploadUrl, downloadUrl },
    } = await axios.post<{ downloadUrl: string; uploadUrl: string }>(`/api/hosts/${createdHost.id}/upload`, {
      name: image.name,
    });

    await uploadMedia(uploadUrl, image);

    const { data: updatedHost } = await axios.post<PartyBoxHost>(`/api/hosts/${createdHost.id}`, {
      ...newHostData,
      imageUrl: downloadUrl,
    });

    return updatedHost;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default createHost;
