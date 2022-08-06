import { PartyBoxEvent } from "../types";

const encodeNotificationMessage = (message: string, { location, startTime, name }: PartyBoxEvent) => {
  return message.replace(location, "{location}").replace(startTime, "{startTime}").replace(name, "{name}");
};

export default encodeNotificationMessage;
