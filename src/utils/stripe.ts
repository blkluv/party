import { Stripe } from "stripe";
import { env } from "~/config/env";

export const getStripeClient = () => {
  return new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });
};
