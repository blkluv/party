import zod from "zod";
import { TicketModel } from "../schema";

type PartyBoxEventTicket = zod.input<typeof TicketModel>;

export default PartyBoxEventTicket;
