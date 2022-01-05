export default interface UserDocument {
    uid: string;
    name?: string;
    email?: string;
    role: "default" | "host" | "admin";
    phoneNumber: string;
    photoURL?: string;
    createdAt: Date;
    updatedAt: Date;
}