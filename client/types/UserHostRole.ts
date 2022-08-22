import { PartyBoxHostRole, PartyBoxUser } from "@party-box/common";

type UserHostRole = Pick<PartyBoxUser, "name" | "email" | "id"> & Pick<PartyBoxHostRole, "role">;

export default UserHostRole;
