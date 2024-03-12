import Stripe from "stripe";
import env  from "../config/dotenv.config";

export default class PaymentsService {
  private stripe;
  constructor() {
    this.stripe = new Stripe(env.STRIPE_SECRET || "");
  }
  createPaymentIntent(data: any) {
    return this.stripe.checkout.sessions.create(data);
  }
}
