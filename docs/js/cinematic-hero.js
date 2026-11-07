/* Navegación progresiva de portada para GitHub Pages, sin dependencias. */
(() => {
  const hero = document.querySelector(".cinematic-hero");
  if (!hero) return;
  const base = "/descubriendovenezuela/";
  const slides = [
    {
      name: "Cayo Sombrero", region: "Falcón · Caribe venezolano",
      kicker: "Mar, naturaleza y cultura",
      title: "VENEZUELA", secondLine: "POR DESCUBRIR",
      description: "Un país de paisajes extraordinarios, historias y rincones por conocer. Explora lugares documentados de cada región.",
      image: "media/foto-cayo-sombrero.webp", link: "lugares/cayo-sombrero/",
      credit: "AndreaC11", creditUrl: "https://commons.wikimedia.org/wiki/File:Cayo_Sombrero.JPG",
      license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    },
    {
      name: "Canaima", region: "Bolívar · Gran Sabana",
      kicker: "Naturaleza monumental",
      title: "CANAIMA", secondLine: "SIN LÍMITES",
      description: "Tepuyes, cascadas y paisajes que invitan a descubrir el sur de Venezuela a través de sus lugares y sus historias.",
      image: "media/foto-701.webp", link: "lugares/701/",
      credit: "Rafael Estrella", creditUrl: "https://commons.wikimedia.org/wiki/File:Salto_Angel_from_above.jpg",
      license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    },
    {
      name: "Cayo de Agua", region: "Dependencias Federales · Los Roques",
      kicker: "Horizontes del Caribe",
      title: "LOS ROQUES", secondLine: "POR EXPLORAR",
      description: "Islas, arena y horizontes azules forman parte de la diversidad de destinos venezolanos reunidos en esta guía.",
      image: "media/foto-cayo-de-agua.webp", link: "lugares/cayo-de-agua/",
      credit: "Tucanrecords", creditUrl: "https://commons.wikimedia.org/wiki/File:Cayo_de_Agua_in_Los_Roques.jpg",
      license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    },
  ];
  const $ = selector => hero.querySelector(selector);
  const backdrop = $(".cinematic-hero__backdrop img");
  const title = $(".cinematic-hero h1");
  const second = $(".cinematic-hero h1 span");
  const kicker = $(".cinematic-hero__eyebrow");
  const description = $(".cinematic-hero__description");
  const detailLink = $(".cinematic-hero__secondary");
  const creditLinks = hero.querySelectorAll(".cinematic-hero__credit a");
  const counter = $(".cinematic-hero__counter");
  const previews = Array.from(hero.querySelectorAll(".cinematic-hero__preview"));
  const dots = Array.from(hero.querySelectorAll(".cinematic-hero__timeline button"));
  let index = 0;
  function render(next) {
    index = (next + slides.length) % slides.length;
    const slide = slides[index];
    backdrop.src = base + slide.image;
    kicker.textContent = slide.kicker;
    // Conservar el elemento secundario para no perder el estilo o el anuncio accesible.
    title.firstChild.textContent = slide.title;
    second.textContent = slide.secondLine;
    description.textContent = slide.description;
    detailLink.href = base + slide.link;
    detailLink.textContent = "Conocer " + slide.name + " ↗";
    creditLinks[0].href = slide.creditUrl;
    creditLinks[0].textContent = slide.credit;
    creditLinks[1].href = slide.licenseUrl;
    creditLinks[1].textContent = slide.license;
    counter.firstChild.textContent = String(index + 1).padStart(2, "0") + " ";
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
      dot.setAttribute("aria-pressed", String(i === index));
    });
    previews.forEach((button, offset) => {
      const destination = (index + offset + 1) % slides.length;
      const featured = slides[destination];
      button.dataset.index = String(destination);
      button.setAttribute("aria-label", "Mostrar " + featured.name);
      button.querySelector("img").src = base + featured.image;
      button.querySelector(".cinematic-hero__preview-kicker").textContent = featured.region;
      button.querySelector(".cinematic-hero__preview-name").textContent = featured.name;
    });
  }
  dots.forEach((button, destination) => button.addEventListener("click", () => render(destination)));
  previews.forEach(button => button.addEventListener("click", () =>
    render(Number(button.dataset.index))));
  hero.querySelector('[data-direction="-1"]').addEventListener("click", () => render(index - 1));
  hero.querySelector('[data-direction="1"]').addEventListener("click", () => render(index + 1));
})();
