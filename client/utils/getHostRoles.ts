import axios from "axios";
import UserHostRole from "~/types/UserHostRole";

const getHostRoles = async (hostId: number, token: string) => {
  try {
    const { data } = await axios.get<UserHostRole[]>(`/api/hosts/${hostId}/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getHostRoles;
