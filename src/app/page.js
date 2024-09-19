import styles from "./page.module.css";
import { Categorias } from "./components/Categorias";
import { Produtos } from "./components/Produtos";

async function getTodosProdutos() {
  const res = await fetch('https://api.npoint.io/4439bdaeab3388861784/produtos');
  if (!res.ok) throw new Error('Não foi possível obter os dados da API');

  const produtos = await res.json();
  return produtos;
}

async function getCategorias() {
  const res = await fetch('https://api.npoint.io/318ac1a90673d10faaa7/categorias');
  if(!res.ok) throw new Error('Não foi possível obter as categorias na API');

  const categorias = await res.json();
  return categorias
}

export default async function Home() {
  const produtos = await getTodosProdutos();
  const categorias = await getCategorias();

  return (
    <>
      <main className={styles.main}>
        <Categorias categorias={categorias} />
        <Produtos produtos={produtos} />
      </main>
    </>
  );
}
