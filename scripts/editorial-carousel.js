// Desplazamiento horizontal fluido para noticias y creadores, sin saltos por tarjeta.
(() => {
  for (const type of ["news","creators"]) {
    const track=document.querySelector("[data-"+type+"-track]");
    if (!track) continue;
    const prev=document.querySelector("[data-"+type+"-prev]");
    const next=document.querySelector("[data-"+type+"-next]");
    const status=document.querySelector("[data-"+type+"-counter]");
    const items=Array.from(track.children);
    if (!prev || !next || !status || !items.length) continue;
    const sync=()=>{
      const max=Math.max(0,track.scrollWidth-track.clientWidth);
      const pos=Math.max(0,track.scrollLeft);
      const first=items[0];
      let nearest=0,distance=Infinity;
      items.forEach((item,i)=>{
        const delta=Math.abs(item.offsetLeft-first.offsetLeft-pos);
        if(delta<distance){distance=delta;nearest=i;}
      });
      prev.disabled=pos<=2;
      next.disabled=pos>=max-2;
      status.textContent=(nearest+1)+" / "+items.length;
    };
    const move=direction=>{
      const max=Math.max(0,track.scrollWidth-track.clientWidth);
      if(max<=2)return;
      track.scrollBy({
        left:direction*Math.max(145,Math.round(track.clientWidth*.68)),
        behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"
      });
    };
    prev.addEventListener("click",()=>move(-1));
    next.addEventListener("click",()=>move(1));
    track.addEventListener("scroll",sync,{passive:true});
    track.addEventListener("keydown",event=>{
      if(event.key==="ArrowRight"){event.preventDefault();move(1);}
      if(event.key==="ArrowLeft"){event.preventDefault();move(-1);}
    });
    window.addEventListener("resize",sync,{passive:true});
    sync();
  }
})();
