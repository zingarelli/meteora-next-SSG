# Utilizando Nextjs para geração de site estático (SSG)

![Banner escrito: "Meteora - Moda de Impacto Positivo"](https://github.com/user-attachments/assets/44837162-73ae-4238-a480-15932c8d11c3)

## Créditos

Este é um fork da aplicação criada pela Alura, que é utilizada no curso [Next.js: gerando site estático com SSG](https://www.alura.com.br/curso-online-next-js-gerando-site-estatico-ssg), ministrado pela [Patrícia Silva](https://github.com/gss-patricia). É uma aplicação que simula um e-commerce de produtos chamado "Meteora", contendo uma a página inicial que lista todos os produtos, e a página de detalhes de cada produto. Outras funcionalidades de e-commerce como adicionar ao carrinho, selecionar quantidades, etc, **não** são implementadas.

## 🔨 Funcionalidades do projeto

O aplicativo consiste em duas páginas principais: a primeira lista produtos e categorias, enquanto a segunda exibe detalhes específicos de cada produto. Atualmente, esta última é uma página **gerada no lado do servidor**, utilizando **rotas dinâmicas**. 

Ao longo do curso, o principal desafio será **converter** as rotas dinâmicas da página de detalhes do produto em **páginas estáticas exportadas, consumindo API externa** para popular as informações.

## ✔️ Técnicas e tecnologias utilizadas

As principais técnicas e tecnologias abordadas são:

- `Next.js`: Framework para React com recursos de SSG.
- `Fetch API`: Realizar requisições HTTP para buscar dados.
- `React Components`: Componentes reutilizáveis.
- `Web server`: Como hospedar o site.

## 🛠️ Abrir e rodar o projeto

Após baixar o projeto, siga estes passos:

- Abra o terminal no diretório do projeto.
- Execute `npm i` para instalar as dependências.
- Inicie o servidor de desenvolvimento com `npm run dev`.
- Acesse `http://localhost:3000` no navegador para ver o projeto.

## Geração de site estático 

**SSG**: Static Site Generation.

O Next oferece a possibilidade de gerar páginas estáticas, isto é, gerar o HTML para a página **durante o build** (comando `npm run build`). Com isso, **a página é gerada somente uma vez** e **reutilizada a cada requisição** feita ao servidor, ao invés de ser renderizada novamente a cada nova requisição. 

A utilização de SSG em páginas que são muito acessadas ou que não mudam com frequência, como posts em blogs e página de detalhes de um produto em um e-commerce, pode trazer vantagens em termos de **performance e otimização de recursos de rede**, já que o conteúdo está previamente construído e só precisa ser devolvido ao cliente. Além disso, CDNs (Content Delivery Networks) podem distribuir essas páginas estáticas de maneira otimizada e escalável para o mundo inteiro.

A diferença para **SSR (Server-Side Rendering)** é o momento da geração do HTML: no SSR, o servidor constroi a página HTML no **momento da requisição** feita pelo cliente. Isso é feito a cada nova requisição. O SSR vale a pena para aplicações cujo conteúdo é dinâmico ou personalizado, e que muda constantemente (por exemplo, a timeline de uma rede social), entregando uma melhor experiência para a pessoa usuária.

Lista de funcionalidades não suportadas em SSG: https://nextjs.org/docs/app/building-your-application/deploying/static-exports#unsupported-features

### Verificando a build da aplicação

Podemos fazer um build da aplicação com o comando `npm run build` (ou `yarn build`). Em sua configuração padrão, o Next irá compilar os códigos, fazer suas otimizações e criar as páginas. O resultado, por padrão, disso fica em uma pasta `./next` na raiz da aplicação. 

Na linha de comando, podemos verificar quais páginas estão sendo geradas de maneira estática ou dinâmica. Segue um exemplo de saída do Next após rodar o build; observe ao final as indicações para conteúdo estático (`○`) e dinâmico (`ƒ`):

```shell
Route (app)                              Size     First Load JS
┌ ○ /                                    1.17 kB        93.3 kB
├ ○ /_not-found                          871 B            88 kB
├ ○ /api/produtos                        0 B                0 B
└ ƒ /produto/[slug]                      1.38 kB        93.6 kB
+ First Load JS shared by all            87.1 kB
  ├ chunks/23-088da993b647466e.js        31.6 kB
  ├ chunks/fd9d1056-be48aeae6e94b8d1.js  53.6 kB
  └ other shared chunks (total)          1.91 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
●  (SSG)      prerendered as static HTML (uses getStaticProps)
```

### Geração estática de rotas dinâmicas

Segmentos de rotas dinâmicas (ex.: `/produto/[slug]`) também podem ser gerados estaticamente. Para isso, é necessário **implementar a função `generateStaticParams`** no arquivo `page.js` da rota dinâmica. Nessa função, fazemos o fetch dos dados que possuem os parâmetros dinâmicos (`slug`, por exemplo) e **retornamos um array de objetos**, em que cada objeto representa um item do segmento dinâmico.

Exemplo:

```js
// -- produto/[slug]/page.jsx
export async function generateStaticParams() {
  // recuperando todos os itens de produtos
  const res = await fetch(`https://api.npoint.io/4439bdaeab3388861784/produtos`);
  
  if (!res.ok) throw new Error('Não foi possível obter os dados da API');

  const produtos = await res.json();

  // retornando um array de objetos com o slug de cada produto
  return produtos.map(produto => ({ 
    slug: produto.id.toString() 
  }));
}
```

Durante o build, essa função é chamada e utiliza o array de objetos para construir a página para cada rota, passando a propriedade do objeto para a prop `params` da página. Por exemplo, durante o build será construído o HTML para as rotas `/produto/1`, `/produto/2`, etc.

> Também funciona para rotas dinâmicas aninhadas (ex.: `/produto/[categoria]/[slug]`). Veja [exemplos na documentação](https://nextjs.org/docs/app/api-reference/functions/generate-static-params#multiple-dynamic-segments).

### Exportando site estático

É possível solicitar ao Next para que o resultado do build seja um site estático cuja estrutura de pastas e arquivos esteja preparada para ser feito o **deploy para qualquer servidor web** que suporte assets estáticos de HTML, CSS e JS, com um arquivo HTML para cada rota. Para isso, incluímos algumas configurações adicionais ao arquivo `next.config.mjs`.

```js
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "raw.githubusercontent.com",
    //     pathname: "**",
    //   },
    // ],
    // utilizando um loader customizado
    loader: 'custom',
    loaderFile: './src/app/imageLoader.js'
  },
};
```

- `output: "export"`: opção que habilita a exportação estática;
- `trailingSlash: true`: em conjunto com o `output: "export"`, essa opção cria um subdiretório para cada rota e adiciona a ele um index.html, mantendo o padrão das rotas dinâmicas. Por exemplo: `sua_url/produto/1` terá uma pasta `/produto/1/index.html` ao invés de `/produto/1.html`;
- `loader` e `loaderFile` são configurações para otimização das imagens em um site estático. Veja [mais sobre isso abaixo](#otimização-de-imagem-em-exportação-estática).

Após o build (`npm run build`), uma pasta `/out` será gerada contendo todo o conteúdo estático do site. Você pode então transferir o conteúdo dessa pasta para o serviço de hospedagem que você utiliza.

> Caso tente rodar o site estático localmente usando o Live Server (extensão do VS Code), pode enfrentar problemas com os caminhos das rotas e imports por conta do uso de caminhos relativos no código. Para **testar localmente**, uma solução é usar o [**http-server**](https://www.npmjs.com/package/http-server). Navegue até a pasta `/out` e execute o comando `npx http-server`.

> Para hospedar no GitHub Pages, é necessário adicionar `basePath` e `assetPrefix` ao arquivo `next.config.mjs`. Este [vídeo no Youtube](https://www.youtube.com/watch?v=yRz8D_oJMWQ) explica como isso é feito. 

#### Otimização de imagem em exportação estática

Para manter as otimizações de imagem disponibilizadas pelo Next (quando usamos o componente `Image` do Next) e continuar rodando a aplicação corretamente em modo de desenvolvimento (`npm run dev`), precisamos criar um loader customizado para as imagens. Essa função será utilizada para montar a URL que faz o fetch da imagem. 

No exemplo abaixo, temos a função githubLoader que recebe como argumento um objeto com os atributos vindos de um componente `Image` e retorna a URL com os parâmetros que o github usa para requisitar a imagem:

```js
export default function githubLoader({ src, width, quality }) {
    return `${src}?w=${width}&q=${quality ?? 75}`
}
```