// Plan personal de visitas. Jornadas elegidas por la persona, sin rutas ni horarios inferidos.
(()=>{
 const toggle=document.getElementById("trip-planner-toggle"),
  panel=document.getElementById("trip-planner"),
  groups=document.getElementById("trip-planner-groups"),
  count=document.getElementById("trip-planner-count"),
  copy=document.getElementById("trip-planner-copy"),
  message=document.getElementById("trip-planner-message"),
  exportArea=document.getElementById("trip-planner-export"),
  results=document.getElementById("results");
 if(!toggle||!panel||!groups||!count||!copy||!message||!exportArea||!results)return;
 const base="/descubriendovenezuela/";
 const savedKey="venezuela-en-el-mapa.guardados.v1";
 const planKey="venezuela-en-el-mapa.plan.v1";
 const checklistKey="venezuela-en-el-mapa.verificaciones.v1";
 // El generador reemplaza esta constante por URLs documentales del catálogo.
 const EVIDENCE=Object.create(null);
 const reviewOptions=[
  ["access","Acceso y permisos"],
  ["transport","Transporte y llegada"],
  ["services","Horarios y servicios"],
  ["safety","Seguridad y condiciones"]
 ];
 const catalog=new Map();
 for(const card of results.querySelectorAll(".place-card")){
  const link=card.querySelector("a.card-main");
  const href=link?.getAttribute("href")||"";
  const id=href.match(/\/lugares\/([a-z0-9-]+)\/?$/)?.[1];
  if(id)catalog.set(id,{href,name:card.dataset.name||"Destino",region:card.dataset.region||"Territorio por confirmar"});
 }
 const readSaved=()=>{
  try{
   const value=JSON.parse(localStorage.getItem(savedKey)||"[]");
   return Array.isArray(value)?[...new Set(value.filter(id=>typeof id==="string"&&catalog.has(id)))]:[];
  }catch{return [];}
 };
 const readAssignments=()=>{
  const data=Object.create(null);
  try{
   const value=JSON.parse(localStorage.getItem(planKey)||"{}");
   if(value&&typeof value==="object"&&!Array.isArray(value)){
    for(const [id,day] of Object.entries(value)){
     if(catalog.has(id)&&Number.isInteger(day)&&day>=1&&day<=7)data[id]=day;
    }
   }
  }catch{}
  return data;
 };
 const readChecks=()=>{
  const data=Object.create(null);
  try{
   const parsed=JSON.parse(localStorage.getItem(checklistKey)||"{}");
   if(parsed&&typeof parsed==="object"&&!Array.isArray(parsed)){
    for(const [id,flags] of Object.entries(parsed)){
     if(!catalog.has(id)||!flags||typeof flags!=="object"||Array.isArray(flags))continue;
     const selected=Object.create(null);
     for(const [key] of reviewOptions)if(flags[key]===true)selected[key]=true;
     if(Object.keys(selected).length)data[id]=selected;
    }
   }
  }catch{}
  return data;
 };
 let checks=readChecks();
 const saveChecks=()=>{
  const selected=new Set(readSaved());
  const clean=Object.create(null);
  for(const [id,flags] of Object.entries(checks))if(selected.has(id)&&Object.keys(flags).length)clean[id]=flags;
  checks=clean;
  try{localStorage.setItem(checklistKey,JSON.stringify(clean));return true;}
  catch{
   message.textContent="No se pudo guardar la revisión personal. Revisa los permisos de almacenamiento.";
   return false;
  }
 };
 let assignments=readAssignments();
 let open=new URLSearchParams(location.search).get("plan")==="1";
 const dayLabel=day=>day?"Jornada "+day:"Por organizar";
 const syncUrl=()=>{
  const current=new URL(location.href);
  if(open)current.searchParams.set("plan","1");
  else current.searchParams.delete("plan");
  history.replaceState(null,"",current.pathname+(current.search||""));
 };
 const updateOpen=()=>{
  panel.hidden=!open;
  toggle.setAttribute("aria-expanded",String(open));
  toggle.textContent=open?"Cerrar mi plan":"Mi plan de visitas";
  if(open)render();
 };
 const saveAssignments=()=>{
  const current=new Set(readSaved());
  const kept=Object.create(null);
  for(const [id,day] of Object.entries(assignments))if(current.has(id)&&day>=1&&day<=7)kept[id]=day;
  assignments=kept;
  try{
   localStorage.setItem(planKey,JSON.stringify(kept));
   return true;
  }catch{
   message.textContent="No se pudieron conservar los cambios: el navegador bloqueó el almacenamiento.";
   return false;
  }
 };
 const savedGroups=()=>{
  const items=readSaved().map(id=>({id,...catalog.get(id),day:assignments[id]||0}));
  return Array.from({length:8},(_,day)=>({day,items:items.filter(item=>item.day===day)}));
 };
 const createPlace=(item)=>{
  const li=document.createElement("li");li.className="trip-planner__place";
  const destination=document.createElement("div");destination.className="trip-planner__destination";
  const link=document.createElement("a");link.href=item.href;link.textContent=item.name;
  const region=document.createElement("small");region.textContent=item.region;
  destination.append(link,region);
  const wrapper=document.createElement("div");wrapper.className="trip-planner__day-control";
  const label=document.createElement("label");label.htmlFor="trip-day-"+item.id;label.textContent="Jornada";
  const select=document.createElement("select");select.id="trip-day-"+item.id;
  select.setAttribute("aria-label","Jornada de "+item.name);
  for(let day=0;day<=7;day++){
   const option=document.createElement("option");option.value=String(day);
   option.textContent=day?String(day):"Sin asignar";
   select.append(option);
  }
  select.value=String(item.day);
  select.addEventListener("change",()=>{
   const day=Number(select.value);
   if(day>=1&&day<=7)assignments[item.id]=day;
   else delete assignments[item.id];
   const ok=saveAssignments();
   render();
   document.getElementById("trip-day-"+item.id)?.focus();
   if(ok)message.textContent="Jornada actualizada. Los cambios quedan en este navegador.";
  });
  wrapper.append(label,select);
  li.append(destination,wrapper);
  const details=document.createElement("details");
  details.className="trip-planner__review";
  const summary=document.createElement("summary");
  summary.textContent="Preparar visita";
  details.append(summary);
  const help=document.createElement("p");
  help.textContent="Marca solo lo que hayas revisado personalmente; no certifica que el lugar esté operativo.";
  details.append(help);
  const checksWrap=document.createElement("div");checksWrap.className="trip-planner__checks";
  for(const [key,label] of reviewOptions){
   const itemLabel=document.createElement("label");
   const checkbox=document.createElement("input");
   checkbox.type="checkbox";
   checkbox.checked=checks[item.id]?.[key]===true;
   checkbox.setAttribute("aria-label",label+" de "+item.name+": revisado por mí");
   const text=document.createElement("span");text.textContent=label;
   checkbox.addEventListener("change",()=>{
    if(!checks[item.id])checks[item.id]=Object.create(null);
    if(checkbox.checked)checks[item.id][key]=true;else delete checks[item.id][key];
    if(!Object.keys(checks[item.id]).length)delete checks[item.id];
    if(saveChecks())message.textContent="Revisión personal actualizada en este navegador.";
   });
   itemLabel.append(checkbox,text);checksWrap.append(itemLabel);
  }
  details.append(checksWrap);
  const source=EVIDENCE[item.id];
  if(typeof source==="string"&&/^https:\/\//.test(source)){
   const link=document.createElement("a");
   link.href=source;link.target="_blank";link.rel="noopener noreferrer";
   link.className="trip-planner__source";
   link.textContent="Consultar fuente documental";
   details.append(link);
   const note=document.createElement("p");note.className="trip-planner__source-note";
   note.textContent="La fuente describe el destino; no verifica accesos, transporte ni servicios actuales.";
   details.append(note);
  }
  li.append(details);
  return li;
 };
 const render=()=>{
  if(!open)return;
  const selected=readSaved();
  count.textContent=selected.length===1?"1 destino guardado":selected.length+" destinos guardados";
  copy.disabled=selected.length===0;
  groups.replaceChildren();
  exportArea.hidden=true;exportArea.value="";
  if(!selected.length){
   const empty=document.createElement("p");
   empty.className="trip-planner__empty";
   empty.textContent="No hay destinos guardados. Marca el corazón de un lugar para incorporarlo a tu plan.";
   groups.append(empty);
   return;
  }
  const itinerary=savedGroups();
  for(const group of itinerary){
   if(!group.items.length)continue;
   const section=document.createElement("section");
   section.className="trip-planner__group";
   const title=document.createElement("h3");title.textContent=dayLabel(group.day);
   const list=document.createElement("ol");list.className="trip-planner__list";
   for(const item of group.items)list.append(createPlace(item));
   section.append(title,list);groups.append(section);
  }
 };
 const buildSummary=()=>{
  const lines=["Mi plan de visitas — Venezuela en el Mapa",
   "Jornadas asignadas personalmente. Sin distancias, rutas, horarios ni reservas verificadas.",""];
  for(const group of savedGroups()){
   if(!group.items.length)continue;
   lines.push(dayLabel(group.day));
   for(const item of group.items){
    lines.push("- "+item.name+" ("+item.region+") — "+base+"lugares/"+item.id+"/");
    for(const [key,label] of reviewOptions)
     lines.push("  "+label+": "+(checks[item.id]?.[key]?"Revisado por mí":"Pendiente"));
    if(EVIDENCE[item.id])lines.push("  Fuente documental: "+EVIDENCE[item.id]);
   }
   lines.push("");
  }
  lines.push("Antes de viajar: confirma acceso, permisos, transporte, seguridad y condiciones actuales.");
  return lines.join("\n");
 };
 toggle.addEventListener("click",()=>{
  open=!open;message.textContent="";syncUrl();updateOpen();
 });
 copy.addEventListener("click",async()=>{
  const value=buildSummary();
  if(!readSaved().length)return;
  try{
   if(!navigator.clipboard?.writeText)throw Error("Portapapeles no disponible");
   await navigator.clipboard.writeText(value);
   message.textContent="Resumen copiado al portapapeles.";
  }catch{
   exportArea.hidden=false;exportArea.value=value;exportArea.focus();exportArea.select();
   message.textContent="No se pudo copiar automáticamente. El resumen está seleccionado para copiarlo manualmente.";
  }
 });
 document.addEventListener("click",event=>{
  if(event.target instanceof Element&&event.target.closest(".place-favorite")){
   assignments=readAssignments();
   if(open)render();
  }
 });
 window.addEventListener("storage",event=>{
  if(event.key===savedKey||event.key===planKey||event.key===checklistKey){
   assignments=readAssignments();checks=readChecks();if(open)render();
  }
 });
 window.addEventListener("pageshow",event=>{
  if(event.persisted){assignments=readAssignments();checks=readChecks();if(open)render();}
 });
 updateOpen();
})();