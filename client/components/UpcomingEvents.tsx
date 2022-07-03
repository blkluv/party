import axios from "axios";
import { useEffect } from "react";

const UpcomingEvents = () => {
  const getUpcomingEvents = async () => {
    try {
      const { data } = await axios.get("/api/events/upcoming");
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getUpcomingEvents();
  }, []);

  return null;
};

export default UpcomingEvents;
