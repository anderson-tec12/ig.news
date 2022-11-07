/* eslint-disable import/no-anonymous-default-export */
// listen --forward-to  localhost:3000/api/webhooks
// whsec_jKvBnvECkZJCDx4NZRcNmeIkKADPbg1G

import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

// transformação de stream
async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  // 'customer.subscription.created',
  "customer.subscription.deleted",
  "customer.subscription.updated",
  // 'invoice.updated'
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Rota iniciada");

  if (req.method === "POST") {
    console.log("Rota è post");

    const buf = await buffer(req);

    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("erro ao contruir o objeto de evento");
      return res.status(400).send(`WEBHOOK error ${err.message}`);
    }

    const { type } = event;

    console.log("###########################################################");
    console.log("evento sem error", event);

    if (relevantEvents.has(type)) {
      console.log("evento Recebido", type);

      try {
        switch (type) {
          //  case 'customer.subscription.created':
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id.toString(),
              subscription.customer.toString(),
              false
            );

            break;
          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );
            break;

          default:
            throw new Error("Unhandled event.");
        }
      } catch (err) {
        return res.json({ error: "Webhook handler error" });
      }
    } else {
      console.log("nao entro no if");
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
