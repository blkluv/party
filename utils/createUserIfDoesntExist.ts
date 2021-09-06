import { db } from "@config/firebase";
import defaultUserProperties from "@config/defaultUserProperties";

/**
 * Creates a document within the users collection if there isn't already one 
 * @param uid UID of currently logged in user
 */
export default async function createUserIfDoesntExist(uid: string, properties: object) {
    if (!uid) return;

    /**
     * Get existing user doc
     */
    const user = await db.doc(`users/${uid}`).get();

    /**
     * Check if this document actually exists
     */
    if (user.exists === false)
        try {
            /**
             * Write the new data
             */
            await db.doc(`users/${uid}`).set({ ...defaultUserProperties, ...properties, uid })
        } catch (e) {
            console.error("Error writing user data");
        }

}
