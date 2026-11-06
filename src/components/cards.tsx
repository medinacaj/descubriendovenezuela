import Link from "next/link";
import { Place } from "../lib/domain";
const icons: Record<string, string> = {
  Naturaleza: "↟", Hospedaje: "⌂", Gastronomía: "◒",
  Cultura: "▥", "Negocios y servicios": "◇", Localidades: "⌖",
};
export function PlaceCard({ place: p }: { place: Place }) {
  const map = p.mediaCredits?.find(asset => asset.kind === "map" &&
    asset.src.startsWith("media/mapa-") && asset.src.endsWith(".webp"));
  return (
    <Link href={"/lugares/" + p.id} className="place-card">
      {map ? <div className="card-photo" data-kind="map">
        <img src={"/" + map.src} alt={map.alt} loading="lazy" width={900} height={600}/>
      </div> : <div className={"card-art art-" + p.category.toLowerCase()} aria-hidden="true">
        <span>{icons[p.category] || "◇"}</span>
        <small>ILUSTRACIÓN · NO ES UNA FOTOGRAFÍA</small>
      </div>}
      <div className="card-body">
        <div className="card-meta">
          <span>{p.category}</span>
          <b>{p.demo ? "DEMO" : p.catalogId ? "DOCUMENTADO" : "Revisado"}</b>
        </div>
        <h3>{p.name}</h3>
        <p className="location">⌖ {p.territory}</p>
        <div className="card-bottom"><span>{p.priceAmount !== null && p.priceAmount !== undefined && p.priceCurrency && p.priceUnit ? `${p.priceAmount} ${p.priceCurrency} / ${p.priceUnit}` : "Consultar precio"}</span><b aria-hidden="true">↗</b></div>
      </div>
    </Link>
  );
}
