export default interface UserDocument {
    uid: string;
    name: string;
    role: "default" | "host" | "admin";
    phoneNumber: string;
}