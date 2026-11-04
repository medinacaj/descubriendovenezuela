"use client";
import { useEffect, useRef, useState } from "react";
import type { Place } from "../lib/domain";
export default function PlaceMap({ places }: { places: Place[] }) {
  const ref = useRef<HTMLDivElement>(null),
    [failed, setFailed] = useState(false);
  const style = process.env.NEXT_PUBLIC_MAP_STYLE || "/maps/style.json";
  useEffect(() => {
    if (!style || !ref.current) return;
    let map: import("maplibre-gl").Map | undefined;
    let disposed = false;
    import("maplibre-gl").then((m) => {
      if (disposed || !ref.current) return;
      m.setWorkerUrl("/maplibre-gl-worker.mjs");
      map = new m.Map({
        container: ref.current,
        style,
        center: [-66, 8],
        zoom: 4,
        attributionControl: { compact: false },
      });
      map.addControl(new m.NavigationControl());
      map.on("idle", () => {
        if (ref.current) ref.current.dataset.ready = "true";
      });
      map.on("error", () => setFailed(true));
      for (const p of places)
        if (p.lat !== null && p.lon !== null)
          new m.Marker({ color: "#146957" })
            .setLngLat([p.lon, p.lat])
            .setPopup(new m.Popup().setText(p.name))
            .addTo(map);
    });
    return () => {
      disposed = true;
      map?.remove();
    };
  }, [places, style]);
  return (
    <aside className="map-panel">
      {style && !failed ? (
        <div ref={ref} className="live-map" />
      ) : (
        <div className="map-empty">
          <div className="map-grid" aria-hidden="true">
            <span>⌖</span>
          </div>
          <span className="eyebrow">EL MAPA, PASO A PASO</span>
          <h2>
            {failed ? "El mapa no está disponible" : "Un país por situar."}
          </h2>
          <p>
            {failed
              ? "Puedes seguir explorando desde la lista."
              : "El mapa se activará al configurar un proveedor cartográfico. Las fichas demo no tienen coordenadas inventadas."}
          </p>
          <small>No se muestra cartografía ni ubicaciones simuladas.</small>
        </div>
      )}
      <div className="map-caption">
        ⌖ Mapa de referencia · Sin marcadores hasta verificar ubicaciones.
        Límites aproximados de Natural Earth, no oficiales.
      </div>
    </aside>
  );
}
