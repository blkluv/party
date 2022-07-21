const live = process.env.NODE_ENV === "production";
const apiStage = live ? "prod" : "dev";

export const APP_NAME = "Party Box";
export const API_URL = `https://walooe9owi.execute-api.us-east-1.amazonaws.com/${apiStage}`;
export const WEBSITE_URL = live ? "https://party-box.ca/" : "http://localhost:3000/";
