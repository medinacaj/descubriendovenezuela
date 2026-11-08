// Exploración por experiencias, filtros combinables y resultados compartibles.
(()=>{
 const form=document.getElementById("filters"),results=document.getElementById("results");
 if(!form||!results)return;
 const q=document.getElementById("q"),category=document.getElementById("category"),
  region=document.getElementById("region"),image=document.getElementById("imageScope");
 let cards=[...results.querySelectorAll(".place-card")],count=document.getElementById("count"),
  empty=document.getElementById("empty"),more=document.getElementById("show-more"),
  showing=document.getElementById("showing");
 const chips=[...document.querySelectorAll("[data-experience]")],
  views=[...document.querySelectorAll("[data-view-switch]")];
 const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 const params=new URLSearchParams(location.search);
 const allowed=new Set(["playas","montanas","parques","cultura","sabores","posadas"]);
 let experience=allowed.has(params.get("experiencia"))?params.get("experiencia"):"";
 let view=["tarjetas","lista","fichas"].includes(params.get("vista"))?params.get("vista"):"tarjetas";
 const allowedOrders=new Set(["destacados","nombre","estado"]);
 let order=allowedOrders.has(params.get("orden"))?params.get("orden"):"destacados";
 let onlySaved=params.get("guardados")==="1";
 const batchSize=30;
 let limit=batchSize;
 q.value=params.get("q")||"";
 category.value=params.get("category")||"";
 region.value=params.get("region")||"";
 image.value=params.get("imagen")||"";

 const entries=cards.map((card,index)=>{
  const href=card.querySelector("a.card-main")?.getAttribute("href")||"";
  const id=href.match(/\/lugares\/([a-z0-9-]+)\/?$/)?.[1]||"";
  return {card,index,id,name:card.dataset.name||"",region:card.dataset.region||"",button:null};
 });
 const ids=new Map(entries.map(entry=>[entry.card,entry.id]));
 const validIds=new Set(entries.map(entry=>entry.id).filter(Boolean));
 const storageKey="venezuela-en-el-mapa.guardados.v1";
 let saved=new Set();
 try{
  const stored=JSON.parse(localStorage.getItem(storageKey)||"[]");
  if(Array.isArray(stored))saved=new Set(stored.filter(id=>typeof id==="string"&&validIds.has(id)));
 }catch{}
 const persist=()=>{
  try{localStorage.setItem(storageKey,JSON.stringify([...saved]));}catch{}
 };
 const collator=new Intl.Collator("es",{sensitivity:"base",numeric:true});
 const toolbar=document.querySelector(".explorer .catalog-toolbar");
 const preferences=document.createElement("div");preferences.className="explorer-preferences";
 const sortWrap=document.createElement("div");sortWrap.className="explorer-sort";
 const sortLabel=document.createElement("label");
 sortLabel.htmlFor="explorer-order";sortLabel.textContent="Ordenar por";
 const sortSelect=document.createElement("select");
 sortSelect.id="explorer-order";sortSelect.setAttribute("aria-label","Ordenar por");
 for(const [value,label] of [["destacados","Destacados"],["nombre","Nombre A–Z"],["estado","Estado A–Z"]]){
  const option=document.createElement("option");
  option.value=value;option.textContent=label;sortSelect.appendChild(option);
 }
 sortSelect.value=order;sortWrap.append(sortLabel,sortSelect);
 const savedToggle=document.createElement("button");
 savedToggle.type="button";savedToggle.className="explorer-saved-toggle";
 savedToggle.title="Tus destinos se guardan únicamente en este navegador.";
 preferences.append(sortWrap,savedToggle);
 if(toolbar)toolbar.insertBefore(preferences,toolbar.querySelector(".view-switch"));
 const updateSaved=()=>{
  savedToggle.textContent="♡ Solo guardados ("+saved.size+")";
  savedToggle.setAttribute("aria-pressed",String(onlySaved));
  for(const entry of entries){
   if(!entry.button)continue;
   const chosen=saved.has(entry.id);
   entry.button.setAttribute("aria-pressed",String(chosen));
   entry.button.setAttribute("aria-label",(chosen?"Quitar de guardados: ":"Guardar destino: ")+entry.name);
   entry.button.title=chosen?"Quitar de guardados":"Guardar en este navegador";
   entry.button.textContent=chosen?"♥":"♡";
  }
 };
 for(const entry of entries){
  if(!entry.id)continue;
  const button=document.createElement("button");
  button.type="button";button.className="place-favorite";
  entry.button=button;entry.card.appendChild(button);
  button.addEventListener("click",()=>{
   if(saved.has(entry.id))saved.delete(entry.id);
   else saved.add(entry.id);
   persist();render();
  });
 }
 const sortCards=()=>{
  const ordered=[...entries];
  if(order==="nombre")ordered.sort((a,b)=>collator.compare(a.name,b.name)||a.index-b.index);
  else if(order==="estado")ordered.sort((a,b)=>collator.compare(a.region,b.region)||collator.compare(a.name,b.name)||a.index-b.index);
  cards=ordered.map(entry=>entry.card);
  const fragment=document.createDocumentFragment();
  cards.forEach(card=>fragment.appendChild(card));
  results.appendChild(fragment);
 };
 sortCards();

 const setView=()=>{
  results.dataset.view=view;
  views.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.viewSwitch===view)));
 };
 const render=(push=true)=>{
  chips.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.experience===experience)));
  updateSaved();
  let n=0;
  const query=norm(q.value.trim());
  for(const card of cards){
   const img=card.querySelector(".card-photo");
   const imgScope=img?.dataset.imageScope||"pendiente";
   const match=norm(card.dataset.name+" "+card.dataset.description).includes(query)
    &&(!category.value||card.dataset.category===category.value)
    &&(!region.value||card.dataset.region===region.value)
    &&(!image.value||(image.value==="foto"?img?.dataset.kind==="photograph":imgScope===image.value))
    &&(!experience||(card.dataset.experiences||"").split(" ").includes(experience))
    &&(!onlySaved||saved.has(ids.get(card)));
   card.hidden=!match||n>=limit;
   if(match)n++;
  }
  count.textContent=n+(n===1?" lugar":" lugares");
  empty.hidden=n!==0;
  empty.textContent=onlySaved&&saved.size===0?"Todavía no has guardado destinos en este navegador. Desactiva Solo guardados para explorar.":"No hay lugares con estos filtros. Prueba otra opción.";
  showing.textContent=n?"Mostrando "+Math.min(n,limit)+" de "+n+" lugares":"Sin lugares para mostrar";
  more.hidden=n<=limit;
  if(push){
   const queryParams=new URLSearchParams(new FormData(form));
   for(const [key,value] of [...queryParams])if(!value)queryParams.delete(key);
   if(experience)queryParams.set("experiencia",experience);
   if(view!=="tarjetas")queryParams.set("vista",view);
   if(order!=="destacados")queryParams.set("orden",order);
   if(onlySaved)queryParams.set("guardados","1");
   history.replaceState(null,"",location.pathname+(queryParams.size?"?"+queryParams.toString():""));
  }
 };
 setView();
 sortSelect.addEventListener("change",()=>{
  order=sortSelect.value;limit=batchSize;sortCards();render();
 });
 savedToggle.addEventListener("click",()=>{
  onlySaved=!onlySaved;limit=batchSize;render();
 });
 chips.forEach(b=>b.addEventListener("click",()=>{
  experience=b.dataset.experience===experience?"":b.dataset.experience;
  limit=batchSize;render();
 }));
 views.forEach(b=>b.addEventListener("click",()=>{
  view=b.dataset.viewSwitch;setView();render();
 }));
 more.addEventListener("click",()=>{limit+=batchSize;render(false);});
 form.addEventListener("submit",e=>{e.preventDefault();limit=batchSize;render();});
 q.addEventListener("input",()=>{limit=batchSize;render();});
 [category,region,image].forEach(el=>el.addEventListener("change",()=>{limit=batchSize;render();}));
 window.addEventListener("popstate",()=>location.reload());
 // Al volver desde una ficha (incluido bfcache), reflejar guardados nuevos sin recargar.
 const refreshSaved=()=>{
  try{
   const stored=JSON.parse(localStorage.getItem(storageKey)||"[]");
   if(Array.isArray(stored))saved=new Set(stored.filter(id=>typeof id==="string"&&validIds.has(id)));
  }catch{}
  render(false);
 };
 window.addEventListener("pageshow",event=>{if(event.persisted)refreshSaved();});
 window.addEventListener("storage",event=>{if(event.key===storageKey)refreshSaved();});
 render(false);
})();
