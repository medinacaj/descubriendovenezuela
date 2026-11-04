import Link from "next/link";
export default function NotFound() {
  return (
    <section className="section empty">
      <h1>Este lugar aún no está en el mapa.</h1>
      <p>La ficha no existe o no está publicada.</p>
      <Link href="/explorar" className="button">
        Volver a explorar
      </Link>
    </section>
  );
}
