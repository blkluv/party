import { PartyBoxEvent } from "../types";

const decodeNotificationMessage = (message: string, { location, startTime, name }: PartyBoxEvent) => {
  return message.replace("{location}", location).replace("{startTime}", startTime).replace("{name}", name);
};

export default decodeNotificationMessage;
