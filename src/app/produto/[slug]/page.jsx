import styles from "./page.module.css";
import Produto from "@/app/components/Produto";

async function getProdutoPorSlug(id) {
  const res = await fetch(`https://api.npoint.io/4439bdaeab3388861784/produtos`);
  if (!res.ok) throw new Error('Não foi possível obter os dados da API');

  const produtos = await res.json();
  const produto = produtos.find(item => item.id.toString() === id);
  if (!produto) throw new Error('Não foi possível obter os dados de produto na API');
  return produto;
}

export async function generateStaticParams() {
  // recuperando todos os itens de produtos
  const res = await fetch(`https://api.npoint.io/4439bdaeab3388861784/produtos`);
  const produtos = await res.json();

  // retornando um array de objetos com o slug de cada produto
  return produtos.map(produto => ({ slug: produto.id.toString() }));
}

export default async function ProdutoPage({ params }) {
  const produto = await getProdutoPorSlug(params.slug);

  if (!produto) return;

  return (
    <main className={styles.main}>
      <Produto produto={produto} />
    </main>
  );
}
