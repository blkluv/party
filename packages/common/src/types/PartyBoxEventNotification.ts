import zod from "zod";
import { EventNotificationModel } from "../schema";

type PartyBoxEventNotification = zod.input<typeof EventNotificationModel>;

export default PartyBoxEventNotification;
