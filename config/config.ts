const live = process.env.NODE_ENV === "production";

export const APP_NAME = "Party Box";
export const WEBSITE_URL = live ? "https://party.conorroberts.com" : "http://localhost:3000"