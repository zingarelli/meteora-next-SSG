import styles from "./page.module.css";
import { Categorias } from "./components/Categorias";
import { Produtos } from "./components/Produtos";
import { getCategorias } from "../lib/api";

async function fetchProdutosApi() {
  const res = await fetch("http://localhost:3000/api/produtos");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const produtos = await res.json();

  return produtos;
}

export default async function Home() {
  const { produtos } = await fetchProdutosApi();
  const categorias = getCategorias();

  return (
    <>
      <main className={styles.main}>
        <Categorias categorias={categorias} />
        <Produtos produtos={produtos} />
      </main>
    </>
  );
}
