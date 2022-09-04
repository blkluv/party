import { PartyBoxEvent } from "../types";

const formatEventNotification = (message: string, { location, startTime, name }: PartyBoxEvent) => {
  return message.replace("{location}", location).replace("{startTime}", startTime).replace("{name}", name);
};

export default formatEventNotification;
