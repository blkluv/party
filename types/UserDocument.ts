export default interface UserDocument {
    uid: string;
    displayName: string;
    role: "default" | "admin"
}