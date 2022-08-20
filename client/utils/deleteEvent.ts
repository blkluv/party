import axios from "axios";

const deleteEvent = async (id: number, token: string) => {
  try {
    await axios.delete(`/api/events/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default deleteEvent;