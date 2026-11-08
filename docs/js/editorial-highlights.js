// Carruseles continuos de lectura lenta, arrastrables y accesibles al teclado.
// Las tarjetas conservan sus enlaces; nunca se mueve contenido con movimiento reducido.
(() => {
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const speed=19; // píxeles por segundo
  for (const type of ["news","creators"]) {
    const track=document.querySelector("[data-"+type+"-track]");
    if (!track) continue;
    const prev=document.querySelector("[data-"+type+"-prev]");
    const next=document.querySelector("[data-"+type+"-next]");
    const status=document.querySelector("[data-"+type+"-counter]");
    const toggle=document.querySelector("[data-"+type+"-toggle]");
    const items=Array.from(track.children);
    if (!prev || !next || !status || !toggle || !items.length) continue;
    // Se duplican visualmente las tarjetas para que el carrusel avance sin saltar al inicio.
    // Las copias son inertes: no añaden enlaces ni anuncios repetidos para lectores de pantalla.
    for(const item of items){
      const clone=item.cloneNode(true);
      clone.classList.add("editorial-carousel__clone");
      clone.setAttribute("aria-hidden","true");
      clone.setAttribute("inert","");
      clone.querySelectorAll("a,button,[tabindex]").forEach(link=>link.setAttribute("tabindex","-1"));
      track.appendChild(clone);
    }
    const cycleWidth=()=>track.children[items.length].offsetLeft-items[0].offsetLeft;
    const canLoop=()=>cycleWidth()>track.clientWidth+3;
    let paused=reduced.matches;
    const renderToggle=()=>{
      toggle.setAttribute("aria-pressed",String(paused));
      toggle.setAttribute("aria-label",(paused?"Reanudar ":"Pausar ")+(type==="news"?"noticias":"creadores"));
      toggle.textContent=paused?"▶":"Ⅱ";
    };
    toggle.addEventListener("click",()=>{paused=!paused;renderToggle();});
    renderToggle();
    let visible=false,hovering=false,dragging=false,moved=false;
    let startX=0,startLeft=0,last=0,remainder=0,pauseUntil=0,suppressClickUntil=0;
    const sync=()=>{
      const period=cycleWidth();
      if(canLoop() && track.scrollLeft>=period)track.scrollLeft-=period;
      const pos=Math.max(0,track.scrollLeft);
      let nearest=0,shortest=Infinity;
      const first=items[0];
      items.forEach((item,i)=>{
        const delta=Math.abs(item.offsetLeft-first.offsetLeft-pos);
        if(delta<shortest){shortest=delta;nearest=i;}
      });
      prev.disabled=!canLoop();
      next.disabled=!canLoop();
      status.textContent=(nearest+1)+" / "+items.length;
    };
    const pause=(ms=1600)=>{pauseUntil=performance.now()+ms;};
    const move=dir=>{
      pause(3500);
      if(dir<0 && canLoop() && track.scrollLeft<=2)track.scrollLeft=cycleWidth()-2;
      track.scrollBy({
        left:dir*Math.max(145,Math.round(track.clientWidth*.68)),
        behavior:reduced.matches?"auto":"smooth"
      });
    };
    prev.addEventListener("click",()=>move(-1));
    next.addEventListener("click",()=>move(1));
    track.addEventListener("scroll",sync,{passive:true});
    track.addEventListener("mouseenter",()=>{hovering=true;});
    track.addEventListener("mouseleave",()=>{hovering=false;pause(1200);});
    track.addEventListener("focusin",()=>pause(3500));
    track.addEventListener("focusout",()=>pause(1400));
    track.addEventListener("pointerdown",event=>{
      if(event.pointerType!=="mouse"||event.button!==0)return;
      dragging=true;moved=false;startX=event.clientX;startLeft=track.scrollLeft;
      pause(3500);
    });
    track.addEventListener("pointermove",event=>{
      if(!dragging)return;
      const delta=event.clientX-startX;
      if(Math.abs(delta)>6){
        moved=true;track.classList.add("is-dragging");
        if(!track.hasPointerCapture(event.pointerId))track.setPointerCapture(event.pointerId);
      }
      if(moved){
        let target=startLeft-delta;
        const period=cycleWidth();
        if(canLoop() && target<0){startLeft+=period;target+=period;}
        if(canLoop() && target>=period){startLeft-=period;target-=period;}
        track.scrollLeft=target;
      }
    });
    const stopDrag=event=>{
      if(!dragging)return;
      dragging=false;
      track.classList.remove("is-dragging");
      if(moved)suppressClickUntil=performance.now()+300;
      if(track.hasPointerCapture(event.pointerId))track.releasePointerCapture(event.pointerId);
      pause(2400);
    };
    track.addEventListener("pointerup",stopDrag);
    track.addEventListener("pointercancel",stopDrag);
    track.addEventListener("click",event=>{
      if(performance.now()<suppressClickUntil){
        event.preventDefault();event.stopPropagation();
        suppressClickUntil=0;
      }
    },true);
    track.addEventListener("keydown",event=>{
      if(event.key==="ArrowRight"){event.preventDefault();move(1);}
      if(event.key==="ArrowLeft"){event.preventDefault();move(-1);}
    });
    window.addEventListener("resize",sync,{passive:true});
    window.addEventListener("load",sync,{once:true});
    if(typeof ResizeObserver==="function"){
      const observer=new ResizeObserver(sync);
      observer.observe(track);
      items.forEach(item=>observer.observe(item));
    }
    if(typeof IntersectionObserver==="function"){
      const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;},{threshold:.15});
      observer.observe(track);
    } else visible=true;
    const frame=now=>{
      const elapsed=last?Math.min(48,now-last):0;
      last=now;
      const focused=track.contains(document.activeElement);
      if(visible&&!document.hidden&&!paused&&!hovering&&!dragging&&!focused&&now>pauseUntil){
        if(canLoop()){
          const delta=speed*elapsed/1000+remainder;
          const pixels=Math.floor(delta);
          remainder=delta-pixels;
          if(pixels){
            const nextPosition=track.scrollLeft+pixels;
            track.scrollLeft=nextPosition>=cycleWidth()?nextPosition-cycleWidth():nextPosition;
          }
        }
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    sync();
  }
})();
