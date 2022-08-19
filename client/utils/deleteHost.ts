import axios from "axios";

const deleteHost = async (hostId: number, token: string) => {
  try {
    await axios.delete(`/api/hosts/${hostId}`, { headers: { Authorization: `Bearer ${token}` } });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default deleteHost;
