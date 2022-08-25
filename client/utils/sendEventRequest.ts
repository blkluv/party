import axios from "axios";

const sendEventRequest = async (eventRequestData: object) => {
  const { data } = await axios.post("/api/events/request", eventRequestData);
  return data;
};

export default sendEventRequest;
