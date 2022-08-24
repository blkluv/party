import axios from "axios";

const deleteEvent = async (id: number) => {
  try {
    await axios.delete(`/api/events/${id}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default deleteEvent;
