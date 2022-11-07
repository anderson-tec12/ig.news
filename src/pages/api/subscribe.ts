/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";
import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  //So aceitamos reqeusts do tipo post
  if (req.method === "POST") {
    //sessão ativa
    const session = await getSession({ req });

    //pegando os dados do usuario
    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
    );

    let customerId = user.data.stripe_customer_id;

    // se não tive o id do stripe, deve criar esse usuario na plataforma do stripe
    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      });

      // atualizar um usuario por email
      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId, // quem esta comprando
      payment_method_types: ["card"], // tipo de pagamento
      billing_address_collection: "required", // endereço da pessoa
      line_items: [
        // item a ser comprado
        {
          price: "price_1IaLLyLnHhasAJPT3z5ZJ00B",
          quantity: 1,
        },
      ],
      mode: "subscription", // recorrente ou unico
      allow_promotion_codes: true, // cupom de descontos
      success_url: process.env.STRIPE_SUCCESS_URL, // pag caso de suceso
      cancel_url: process.env.STRIPE_CANCEL_URL, // page caso de erro
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
