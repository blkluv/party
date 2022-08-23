import axios from "axios";

const getEventServices = async () => {
  const { data } = await axios.get("/api/services");
  return data;
};

export default getEventServices;
