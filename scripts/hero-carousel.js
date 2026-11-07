/* Proposal B: accesible, progressive homepage destination carousel for GitHub Pages. */
(() => {
  const hero = document.querySelector(".cinematic-hero");
  if (!hero) return;
  const base = "/descubriendovenezuela/";
  const slides = [
    {
      name:"Cayo Sombrero", kicker:"DESCUBRIENDO VENEZUELA",
      title:"Venezuela", second:"natural, diversa y auténtica",
      description:"Playas caribeñas, montañas imponentes, selvas y una cultura llena de historias. Descubre destinos documentados de nuestro país.",
      image:"media/foto-cayo-sombrero.webp", link:"lugares/cayo-sombrero/",
      credit:"AndreaC11", creditUrl:"https://commons.wikimedia.org/wiki/File:Cayo_Sombrero.JPG",
      license:"CC BY-SA 3.0", licenseUrl:"https://creativecommons.org/licenses/by-sa/3.0/"
    },
    {
      name:"Parque Nacional Canaima", kicker:"NATURALEZA EXTRAORDINARIA",
      title:"CANAIMA", second:"paisajes que inspiran",
      description:"Tepuyes, grandes saltos de agua y una riqueza natural singular. Explora las fichas y sus fuentes documentales.",
      image:"media/foto-701.webp", link:"lugares/701/",
      credit:"Rafael Estrella", creditUrl:"https://commons.wikimedia.org/wiki/File:Salto_Angel_from_above.jpg",
      license:"CC BY-SA 2.0", licenseUrl:"https://creativecommons.org/licenses/by/2.0/"
    },
    {
      name:"Cayo de Agua", kicker:"CARIBE VENEZOLANO",
      title:"LOS ROQUES", second:"un paraíso por conocer",
      description:"Descubre paisajes insulares, arenas claras y mares turquesa a través de imágenes acreditadas y datos con fuentes.",
      image:"media/foto-cayo-de-agua.webp", link:"lugares/cayo-de-agua/",
      credit:"Tucanrecords",creditUrl:"https://commons.wikimedia.org/wiki/File:Cayo_de_Agua_in_Los_Roques.jpg",
      license:"CC BY-SA 3.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/3.0/"
    }
  ];
  const $ = selector => hero.querySelector(selector);
  const backdrop = $(".cinematic-hero__backdrop img");
  const heading = $(".cinematic-hero h1");
  const headingSecond = $(".cinematic-hero h1 span");
  const kicker = $(".cinematic-hero__eyebrow");
  const description = $(".cinematic-hero__description");
  const detail = $(".cinematic-hero__secondary");
  const credits = hero.querySelectorAll(".cinematic-hero__credit a");
  const counter = $(".cinematic-hero__counter");
  const dots = Array.from(hero.querySelectorAll(".cinematic-hero__timeline button"));
  const stepBack = hero.querySelector('[data-direction="-1"]');
  const stepNext = hero.querySelector('[data-direction="1"]');
  let index = 0;
  function show(target) {
    index = (target + slides.length) % slides.length;
    const slide = slides[index];
    const photo = base + slide.image;
    const prefix = photo.replace(/\.webp$/, "");
    backdrop.srcset = prefix + "-480.webp 480w, " + prefix + "-800.webp 800w, " + photo + " 1200w";
    backdrop.sizes = "(max-width: 700px) 100vw, (max-width: 1200px) 80vw, 1200px";
    backdrop.src = photo;
    kicker.textContent = slide.kicker;
    heading.firstChild.textContent = slide.title;
    headingSecond.textContent = slide.second;
    description.textContent = slide.description;
    detail.href = base + slide.link;
    detail.textContent = "Conocer " + slide.name + " ↗";
    credits[0].href = slide.creditUrl;
    credits[0].textContent = slide.credit;
    credits[1].href = slide.licenseUrl;
    credits[1].textContent = slide.license;
    counter.firstChild.textContent = String(index + 1).padStart(2, "0") + " ";
    dots.forEach((button,i) => {
      if(i===index) button.setAttribute("aria-current","true");
      else button.removeAttribute("aria-current");
      button.setAttribute("aria-pressed", String(i === index));
    });
  }
  dots.forEach((button,i) => button.addEventListener("click", () => show(i)));
  stepBack.addEventListener("click", () => show(index-1));
  stepNext.addEventListener("click", () => show(index+1));
  hero.addEventListener("keydown", event => {
    if(!event.target.closest(".cinematic-hero__timeline"))return;
    if(event.key==="ArrowRight" || event.key==="ArrowDown") {
      event.preventDefault();show(index+1);dots[index].focus();
    } else if(event.key==="ArrowLeft" || event.key==="ArrowUp") {
      event.preventDefault();show(index-1);dots[index].focus();
    }
  });
})();
