if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/descubriendovenezuela/sw.js",{scope:"/descubriendovenezuela/"}).catch(()=>{}))
// Mejora progresiva para fichas documentales: guardados compartidos con el explorador.
// Se anexa al script común generado por el sitio estático.
;(()=>{
  const intro=document.querySelector(".place-detail .place-intro");
  const match=location.pathname.match(/\/lugares\/([a-z0-9-]+)\/?$/);
  if(!intro||!match)return;
  const id=match[1],name=intro.querySelector("h1")?.textContent?.trim()||"este destino";
  const storageKey="venezuela-en-el-mapa.guardados.v1";
  const read=()=>{
    try{
      const list=JSON.parse(localStorage.getItem(storageKey)||"[]");
      return new Set(Array.isArray(list)?list.filter(value=>typeof value==="string"):[]);
    }catch{return new Set();}
  };
  const actions=document.createElement("div");
  actions.className="place-intro__actions";
  const button=document.createElement("button");
  button.type="button";button.className="place-save-button";
  const link=document.createElement("a");
  link.className="place-save-link";
  link.href="/descubriendovenezuela/explorar/?guardados=1";
  link.textContent="Ver destinos guardados";
  const planLink=document.createElement("a");
  planLink.className="place-plan-link";
  planLink.href="/descubriendovenezuela/explorar/?guardados=1&plan=1";
  planLink.textContent="Organizar mi plan";
  const message=document.createElement("span");
  message.className="place-save-note";message.setAttribute("role","status");
  message.textContent="Se guardan solamente en este navegador.";
  const update=()=>{
    const selected=read().has(id);
    button.setAttribute("aria-pressed",String(selected));
    button.textContent=selected?"♥ Guardado":"♡ Guardar destino";
    button.setAttribute("aria-label",(selected?"Quitar de guardados: ":"Guardar destino: ")+name);
    button.title=selected?"Quitar destino guardado":"Guardar en este navegador";
  };
  button.addEventListener("click",()=>{
    const saved=read();
    if(saved.has(id))saved.delete(id);else saved.add(id);
    try{
      localStorage.setItem(storageKey,JSON.stringify([...saved]));
      message.textContent=saved.has(id)?"Destino guardado en este navegador.":"Destino quitado de guardados.";
      update();
    }catch{
      message.textContent="No se pudo guardar: revisa los permisos de almacenamiento del navegador.";
    }
  });
  actions.append(button,link,planLink,message);
  intro.appendChild(actions);
  window.addEventListener("pageshow",update);
  window.addEventListener("storage",event=>{if(event.key===storageKey)update();});
  update();
})();
