import { WEBSITE_URL } from "./config";

const config = {
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_AO4wSmoNJ",
    userPoolWebClientId: "4768g659min5sg9v5mg595o19p",
    oauth: {
      domain: "party-box.auth.us-east-1.amazoncognito.com",
      scope: ["email", "openid", "profile"],
      redirectSignIn: WEBSITE_URL,
      redirectSignOut: WEBSITE_URL,
      responseType: "code",
    },
  },
};

export default config;
