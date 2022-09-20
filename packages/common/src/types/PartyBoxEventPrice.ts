import zod from "zod";
import { TicketPriceModel } from "../schema";

type PartyBoxEventPrice = zod.infer<typeof TicketPriceModel>;

export default PartyBoxEventPrice;
