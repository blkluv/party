import { PartyBoxHost, PartyBoxHostRole } from "@party-box/common";

type ProfileHostData = Pick<PartyBoxHost & PartyBoxHostRole, "name" | "description" | "imageUrl" | "id" | "role">;

export default ProfileHostData;
