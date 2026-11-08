// Exploración por experiencias, filtros combinables y resultados compartibles.
(()=>{
 const form=document.getElementById("filters"),results=document.getElementById("results");
 if(!form||!results)return;
 const q=document.getElementById("q"),category=document.getElementById("category"),
  region=document.getElementById("region"),image=document.getElementById("imageScope");
 const cards=[...results.querySelectorAll(".place-card")],count=document.getElementById("count"),
  empty=document.getElementById("empty"),more=document.getElementById("show-more"),
  showing=document.getElementById("showing");
 const chips=[...document.querySelectorAll("[data-experience]")],
  views=[...document.querySelectorAll("[data-view-switch]")];
 const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 const params=new URLSearchParams(location.search);
 const allowed=new Set(["playas","montanas","parques","cultura","sabores","posadas"]);
 let experience=allowed.has(params.get("experiencia"))?params.get("experiencia"):"";
 let view=["tarjetas","lista","fichas"].includes(params.get("vista"))?params.get("vista"):"tarjetas";
 const batchSize=30;
 let limit=batchSize;
 q.value=params.get("q")||"";
 category.value=params.get("category")||"";
 region.value=params.get("region")||"";
 image.value=params.get("imagen")||"";
 const setView=()=>{
  results.dataset.view=view;
  views.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.viewSwitch===view)));
 };
 const render=(push=true)=>{
  chips.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.experience===experience)));
  let n=0;
  const query=norm(q.value.trim());
  for(const card of cards){
   const img=card.querySelector(".card-photo");
   const imgScope=img?.dataset.imageScope||"pendiente";
   const match=norm(card.dataset.name+" "+card.dataset.description).includes(query)
    &&(!category.value||card.dataset.category===category.value)
    &&(!region.value||card.dataset.region===region.value)
    &&(!image.value||(image.value==="foto"?img?.dataset.kind==="photograph":imgScope===image.value))
    &&(!experience||(card.dataset.experiences||"").split(" ").includes(experience));
   card.hidden=!match||n>=limit;
   if(match)n++;
  }
  count.textContent=n+(n===1?" lugar":" lugares");
  empty.hidden=n!==0;
  showing.textContent=n?"Mostrando "+Math.min(n,limit)+" de "+n+" lugares":"Sin lugares para mostrar";
  more.hidden=n<=limit;
  if(push){
   const queryParams=new URLSearchParams(new FormData(form));
   for(const [key,value] of [...queryParams])if(!value)queryParams.delete(key);
   if(experience)queryParams.set("experiencia",experience);
   if(view!=="tarjetas")queryParams.set("vista",view);
   history.replaceState(null,"",location.pathname+(queryParams.size?"?"+queryParams.toString():""));
  }
 };
 setView();
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
 render(false);
})();
