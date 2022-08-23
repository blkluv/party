import axios from "axios";

const deleteHost = async (hostId: number) => {
  try {
    await axios.delete(`/api/hosts/${hostId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default deleteHost;
