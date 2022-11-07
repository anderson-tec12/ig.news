import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: "read:user",
    }),
  ],
  // jwt: {
  //   signingKey: process.env.SIGNINGKEY,
  // },
  callbacks: {
    async signIn(user, account, profile) {
      const { email } = user;

      try {
        // console.log(user)
        const { email } = user;

        await fauna.query(
          // executa query no banco
          q.If(
            // se
            q.Not(
              // nao
              q.Exists(
                //exitir
                q.Match(q.Index("user_by_email"), q.Casefold(user.email))
              )
            ),
            // inseri no banco
            q.Create(q.Collection("users"), { data: { email } }),
            // se não pega os dados
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(user.email)))
          )
        );

        return true;
      } catch (err) {
        console.log("ERRO", err);
        return false;
      }
    },
  },
});
