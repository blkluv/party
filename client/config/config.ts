const live = process.env.NODE_ENV === "production";

export const APP_NAME = "Party Box";
export const API_URL = "https://fm2aaoc5el.execute-api.us-east-1.amazonaws.com/dev";
export const WEBSITE_URL = live ? "https://party.conorroberts.com/" : "http://localhost:3000/";
