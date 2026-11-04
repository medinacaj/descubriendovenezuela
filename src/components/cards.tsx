import Link from "next/link";
import { Place } from "../lib/domain";
const icons: Record<string, string> = {
  Naturaleza: "↟",
  Hospedaje: "⌂",
  Gastronomía: "◒",
  Cultura: "▥",
  "Negocios y servicios": "◇",
};
export function PlaceCard({ place: p }: { place: Place }) {
  return (
    <Link href={"/lugares/" + p.id} className="place-card">
      <div
        className={"card-art art-" + p.category.toLowerCase()}
        aria-hidden="true"
      >
        <span>{icons[p.category] || "◇"}</span>
        <small>ILUSTRACIÓN · NO ES UNA FOTOGRAFÍA</small>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>{p.category}</span>
          <b>{p.demo ? "DEMO" : "Revisado"}</b>
        </div>
        <h3>{p.name}</h3>
        <p className="location">⌖ {p.territory}</p>
        <div className="card-bottom">
          <span>Consultar precio</span>
          <b aria-hidden="true">↗</b>
        </div>
      </div>
    </Link>
  );
}
