import zod from "zod";
import { EventModel } from "../schema";

type PartyBoxEvent = zod.input<typeof EventModel>;
export default PartyBoxEvent;
