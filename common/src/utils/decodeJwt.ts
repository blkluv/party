import { JwtPayload, decode } from "jsonwebtoken";

/**
 * Decodes a JWT from the given Authorization header. Verifies that the token claims the specified roles and returns the decoded payload.
 * @param authorization HTTP Authorization header
 * @param roles Roles to verify in the token
 * @returns Decoded JWT payload
 */
const decodeJwt = (authorization?: string, roles?: string[]) => {
  // Check if the user has a permissions
  if (!authorization) throw new Error("Authorization header was undefined.");
  const token = decode(authorization.replace("Bearer ", "")) as JwtPayload;

  roles?.forEach((role) => {
    if (!token["cognito:groups"].includes(role)) {
      throw new Error("Insufficient permissions");
    }
  });

  return token;
};

export default decodeJwt;
