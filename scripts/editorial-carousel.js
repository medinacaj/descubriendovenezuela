// Carrusel navegable con teclado, botones y desplazamiento táctil; sin autoplay.
(() => {
  const track = document.querySelector("[data-creators-track]");
  if (!track) return;
  const prev = document.querySelector("[data-creators-prev]");
  const next = document.querySelector("[data-creators-next]");
  const status = document.querySelector("[data-creators-counter]");
  const items = Array.from(track.children);
  if (!items.length) return;
  let active = 0;
  const sync = () => {
    const first = items[0];
    let nearest = 0, shortest = Infinity;
    items.forEach((item, index) => {
      const distance = Math.abs(item.offsetLeft - first.offsetLeft - track.scrollLeft);
      if (distance < shortest) { shortest = distance; nearest = index; }
    });
    active = nearest;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft < track.scrollWidth - track.clientWidth - 2 ? false : true;
    status.textContent = (active + 1) + " / " + items.length;
  };
  const move = delta => {
    const index = Math.max(0, Math.min(items.length - 1, active + delta));
    track.scrollTo({
      left: items[index].offsetLeft - items[0].offsetLeft,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
    active = index;
    sync();
  };
  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  track.addEventListener("scroll", sync, { passive: true });
  track.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
  });
  sync();
})();
