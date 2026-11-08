// Presentación del explorador: experiencias, fotografías y filtros compactos.
export function renderExplorer({places,card,url,h,regionNames,experiencesFor,experienceOptions}){
 const withPhoto=p=>p.photos.some(m=>m.kind==="photograph");
 const hasMap=p=>p.photos.some(m=>m.kind==="map");
 const ordered=[...places].sort((a,b)=>(Number(withPhoto(b))-Number(withPhoto(a)))||(Number(hasMap(b))-Number(hasMap(a))));
 const choices=experienceOptions.map(e=>`<button type="button" class="experience-choice" data-experience="${e.id}" aria-pressed="false">${h(e.label)}</button>`).join("");
 const results=ordered.map(p=>card(p).replace('<article class="place-card"',`<article class="place-card" data-experiences="${experiencesFor(p).join(" ")}"`)).join("");
 return `<section class="section explorer page-width">
   <span class="eyebrow">EXPLORA A TU MANERA</span>
   <h1>Encuentra tu próximo destino</h1>
   <p class="explorer-intro">Elige lo que te interesa y descubre lugares reales de Venezuela.</p>
   <div class="experience-chooser" role="group" aria-label="Explorar por experiencia">
     <span>¿Qué te provoca conocer?</span>
     <div class="experience-choices">${choices}</div>
   </div>
   <form id="filters" class="filter-bar" role="search">
     <div><label for="q">Buscar lugar</label><input name="q" id="q" placeholder="Nombre o lugar" maxlength="120" autocomplete="off"></div>
     <div><label for="category">Tipo</label><select id="category" name="category"><option value="">Todos</option>${["Naturaleza","Cultura","Hospedaje","Gastronomía","Negocios y servicios","Localidades"].map(c=>`<option>${h(c)}</option>`).join("")}</select></div>
     <div><label for="region">Estado</label><select id="region" name="region"><option value="">Todos los estados</option>${regionNames.map(r=>`<option>${h(r)}</option>`).join("")}</select></div>
     <div><label for="imageScope">Fotografías</label><select id="imageScope" name="imagen"><option value="">Todos los lugares</option><option value="foto">Con fotografía real</option><option value="propia">Foto o mapa propio</option><option value="pendiente">Sin fotografía propia</option></select></div>
     <button class="button" type="submit">Buscar</button>
     <a href="${url("explorar/")}" class="reset">Limpiar</a>
   </form>
   <div class="catalog-toolbar">
     <p role="status" aria-live="polite"><b id="count">${places.length} lugares</b></p>
     <button type="button" id="trip-planner-toggle" class="trip-planner-trigger" aria-expanded="false" aria-controls="trip-planner">Mi plan de visitas</button>
     <div class="view-switch" role="group" aria-label="Cambiar vista"><span>Ver como</span><button type="button" data-view-switch="tarjetas" aria-pressed="true">Tarjetas</button><button type="button" data-view-switch="lista" aria-pressed="false">Lista</button><button type="button" data-view-switch="fichas" aria-pressed="false">Fichas</button></div>
   </div>
   <section id="trip-planner" class="trip-planner" aria-labelledby="trip-planner-title" hidden>
     <div class="trip-planner__head">
       <div><span class="eyebrow">TU SELECCIÓN PERSONAL</span><h2 id="trip-planner-title">Organiza tus visitas</h2>
         <p>Asigna tus destinos guardados a una jornada del 1 al 7. Es un borrador personal, no una ruta calculada ni una reserva.</p>
       </div>
     </div>
     <p id="trip-planner-count" class="trip-planner__count" role="status" aria-live="polite">Sin destinos guardados.</p>
     <div id="trip-planner-groups" class="trip-planner__groups"></div>
     <div class="trip-planner__actions">
       <button type="button" id="trip-planner-copy" disabled>Copiar resumen del plan</button>
       <p id="trip-planner-message" role="status" aria-live="polite"></p>
     </div>
     <textarea id="trip-planner-export" class="trip-planner__export" readonly hidden aria-label="Texto del plan para copiar"></textarea>
     <p class="trip-planner__disclaimer">Confirma acceso, permisos, horarios, transporte y seguridad con fuentes responsables antes de viajar. No estimamos tiempos ni distancias entre los destinos. La selección y las jornadas se guardan solo en este navegador.</p>
   </section>
   <div id="results" class="directory-grid" data-view="tarjetas">${results}</div>
   <div class="load-more-wrap"><p id="showing" role="status" aria-live="polite">Mostrando hasta 30 lugares</p><button id="show-more" type="button" class="button">Mostrar más lugares</button></div>
   <p id="empty" class="empty" hidden>No hay lugares con estos filtros. Prueba otra opción.</p>
   <p class="catalog-note">Las fotos corresponden al lugar indicado. Antes de viajar, consulta información actualizada sobre accesos y servicios.</p>
 </section><script defer src="${url("js/explore-experiences.js")}"></script>`;
}
