import UserDocument from "@typedefs/UserDocument";

export default function getNewUser(): UserDocument {
    return {
        email: null,
        name: null,
        photoURL: null,
        uid: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "default",
        phoneNumber: null
    }
}