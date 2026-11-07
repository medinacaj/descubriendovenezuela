/**
 * Política visual: cada lugar solo puede mostrar sus propias imágenes
 * documentadas. Nunca completar un destino con fotografía de otro lugar.
 * Una imagen de mapa identifica su naturaleza cartográfica; no es una foto.
 */
export function createVisualResolver(_places) {
  return function visualFor(place) {
    const owned = Array.isArray(place.photos) ? place.photos : [];
    const asset = owned.find(photo => photo.kind === "photograph")
      || owned.find(photo => photo.kind === "map")
      || null;
    return {
      asset,
      sourcePlace: asset ? place : null,
      representative: false,
      pending: asset === null,
    };
  };
}
