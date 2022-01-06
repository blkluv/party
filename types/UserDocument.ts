export default interface UserDocument {
    uid: string;
    displayName?: string;
    email?: string;
    role: "default" | "host" | "admin";
    phoneNumber: string;
    photoURL?: string;
    createdAt: Date;
    updatedAt: Date;
}