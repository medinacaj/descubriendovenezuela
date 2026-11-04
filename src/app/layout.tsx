import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Venezuela en el Mapa — Un país por descubrir",
    template: "%s | Venezuela en el Mapa",
  },
  description:
    "Explora la Venezuela natural, cultural y cotidiana. Demo local de una guía construida con información verificable.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <a className="skip" href="#contenido">
          Saltar al contenido
        </a>
        <div className="demo-bar">
          DEMO EN DESARROLLO <span>·</span> Las fichas de ejemplo no representan
          lugares reales.
        </div>
        <header>
          <Link href="/" className="brand">
            <span className="brand-mark">
              V<span>•</span>
            </span>
            <span>
              Venezuela<small>EN EL MAPA</small>
            </span>
          </Link>
          <nav aria-label="Principal">
            <Link href="/explorar">Explorar</Link>
            <Link href="/explorar?category=Naturaleza">Destinos</Link>
            <Link href="/explorar?category=Hospedaje">Hospedaje</Link>
            <Link href="/explorar?category=Gastronomía">Gastronomía</Link>
          </nav>
          <Link className="nav-cta" href="/explorar">
            Descubrir Venezuela <span>↗</span>
          </Link>
        </header>
        <main id="contenido">{children}</main>
        <footer>
          <Link className="footer-brand" href="/">
            Venezuela en el Mapa<span>Un país, miles de historias.</span>
          </Link>
          <p>
            Una guía que empieza por la confianza.
            <br />
            Información útil, comunidades visibles y lugares por conocer.
          </p>
          <div>
            <Link href="/politica-editorial">Política editorial</Link>
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/admin">Acceso editorial</Link>
          </div>
          <small>
            © {new Date().getFullYear()} Venezuela en el Mapa · Demo local, sin
            publicidad.
          </small>
        </footer>
      </body>
    </html>
  );
}
