# IG.News

<p>IG.news é uma plataforma para consumo de publicações de tecnologia,use o seu github para realizar o login e atraves de uma assinatura mensal para consumir os posts completos.</p>


## Tecnologias
<ul>
  <li>Next</li>
  <li>Typescript</li>
  <li>SCSS</li>
  <li>Fauna</li>
  <li>Prismic</li>
  <li>Stripe</li>
</ul>

### Stripe
<p>
Stripe uma paltaforma para pagamentos via cartão de credito. 

Em modo de desenvolvimento permite fazer simulações.
</p>
<a href="https://stripe.com/br" blank="_target">stripe</a>


### Fauna
<p>
  Banco de dados não relacional, usado no projeto para armazenar usuarios que tem assinatura naplataforma.
</p>
<a href="https://fauna.com/" blank="_target">fauna</a>

### Primic CMS
<p>
  Prismic CMS usado para nesta aplicação para a criação dos posts.
</p>
<a href="https://prismic.io/" blank="_target">prismic</a>


## Rodando projeto 

#### .env.local

<code>//STRIPE
STRIPE_API_KEY = Chave da api do stripe
STRIPE_KEY= chave do stripe
STRIPE_SUCCESS_URL=http://localhost:3000/posts
STRIPE_CANCEL_URL=http://localhost:3000/
NEXT_PUBLIC_STRIPE_PUBLIC_KEY= Chave publica de conexão com o stripe

//github
GITHUB_CLIENT_ID= id  de libração do git
GITHUB_CLIENT_SECRET=chave de itegração com o git

Fauna DB
FAUNADB_KEY= chave do fauna

JWT
SIGNINGKEY= gere uma senha qualquer 


PRISMIC 
PRISMIC_CLIENT_ID= ID de acesso ao prismic
PRISMIC_ENDPOINT=Link da api do projeto 
PRISMIC_ACCESS_TOKEN=Token de acesso
</code>