import axios from "axios";

const deleteEvent = async (id: string, token: string) => {
  try {
    await axios.delete(`/api/events/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  } catch (error) {
    console.log(error);
  }
};

export default deleteEvent;
