"use client";
import { useEffect, useRef, useState } from "react";
import highlights from "../../content/editorial-highlights.json";

const dateLabel=(value:string)=>{
 const [year,month,day]=value.split("-").map(Number);
 return day+" "+["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"][month-1]+" "+year;
};
type EditorialImage={src:string;alt:string;caption:string;author:string;sourceUrl:string;license:string;licenseUrl:string};
function EditorialVisual({image,kind}:{image:EditorialImage;kind:"news"|"creators"}){
 const prefix=kind==="news"?"editorial-news":"editorial-creators";
 return <figure className={prefix+"__visual"}>
  <div className={kind==="news"?"editorial-news__art":"editorial-creators__portrait"}>
   <img src={"/"+image.src} alt={image.alt} loading="lazy" decoding="async" width={900} height={600}/>
  </div>
  <figcaption className="editorial-image__credit">{image.caption} · Foto: <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">{image.author}</a>{" · "}<a href={image.licenseUrl} target="_blank" rel="noopener noreferrer">{image.license}</a>{" · Encuadre adaptado"}</figcaption>
 </figure>;
}
function useSlidingTrack(){
 const track=useRef<HTMLDivElement>(null);
 const [state,setState]=useState({index:0,total:0,prev:false,next:false});
 const sync=()=>{
  const element=track.current;if(!element)return;
  const nodes=Array.from(element.children) as HTMLElement[];
  if(!nodes.length)return;
  const pos=Math.max(0,element.scrollLeft),first=nodes[0];
  let index=0,distance=Infinity;
  nodes.forEach((node,i)=>{
   const delta=Math.abs(node.offsetLeft-first.offsetLeft-pos);
   if(delta<distance){distance=delta;index=i;}
  });
  const max=Math.max(0,element.scrollWidth-element.clientWidth);
  const newState={index,total:nodes.length,prev:pos>2,next:pos<max-2};
  setState(current=>current.index===newState.index&&current.total===newState.total&&current.prev===newState.prev&&current.next===newState.next?current:newState);
 };
 const move=(direction:number)=>{
  const element=track.current;if(!element)return;
  element.scrollBy({left:direction*Math.max(145,Math.round(element.clientWidth*.68)),behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
 };
 useEffect(()=>{
  const handler=()=>sync(),element=track.current;
  const observer=typeof ResizeObserver==="function"?new ResizeObserver(handler):null;
  if(element&&observer){observer.observe(element);Array.from(element.children).forEach(child=>observer.observe(child));}
  window.addEventListener("resize",handler);
  window.addEventListener("load",handler);
  const frame=requestAnimationFrame(handler);
  // Movimiento continuo a velocidad de lectura; se suspende con foco, mouse y tacto.
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  let active=true,visible=false,hovering=false,dragging=false,moved=false;
  let startX=0,startLeft=0,last=0,direction=1,pauseUntil=0,suppressUntil=0,animation=0;
  const pause=(duration=1700)=>{pauseUntil=performance.now()+duration;};
  const enter=()=>{hovering=true;};
  const leave=()=>{hovering=false;pause(1200);};
  const focus=()=>pause(3500);
  const blur=()=>pause(1400);
  const down=(event:PointerEvent)=>{
    if(event.pointerType!=="mouse"||event.button!==0||!element)return;
    dragging=true;moved=false;startX=event.clientX;startLeft=element.scrollLeft;
    pause(3500);
  };
  const movePointer=(event:PointerEvent)=>{
    if(!dragging||!element)return;
    const dx=event.clientX-startX;
    if(Math.abs(dx)>6){
      moved=true;element.classList.add("is-dragging");
      if(!element.hasPointerCapture(event.pointerId))element.setPointerCapture(event.pointerId);
    }
    if(moved)element.scrollLeft=startLeft-dx;
  };
  const up=(event:PointerEvent)=>{
    if(!dragging||!element)return;
    dragging=false;element.classList.remove("is-dragging");
    if(moved)suppressUntil=performance.now()+300;
    if(element.hasPointerCapture(event.pointerId))element.releasePointerCapture(event.pointerId);
    pause(2400);
  };
  const click=(event:MouseEvent)=>{
    if(performance.now()<suppressUntil){
      event.preventDefault();event.stopPropagation();suppressUntil=0;
    }
  };
  const io=typeof IntersectionObserver==="function"?new IntersectionObserver(entries=>{
    visible=entries[0]?.isIntersecting??false;
  },{threshold:.15}):null;
  if(element){
    if(io)io.observe(element);else visible=true;
    element.addEventListener("mouseenter",enter);
    element.addEventListener("mouseleave",leave);
    element.addEventListener("focusin",focus);
    element.addEventListener("focusout",blur);
    element.addEventListener("pointerdown",down);
    element.addEventListener("pointermove",movePointer);
    element.addEventListener("pointerup",up);
    element.addEventListener("pointercancel",up);
    element.addEventListener("click",click,true);
  }
  const tick=(now:number)=>{
    if(!active||!element)return;
    const elapsed=last?Math.min(48,now-last):0;
    last=now;
    if(visible&&!document.hidden&&!reduced.matches&&!hovering&&!dragging&&
       !element.contains(document.activeElement)&&now>pauseUntil){
      const max=Math.max(0,element.scrollWidth-element.clientWidth);
      if(max>4){
        if(element.scrollLeft>=max-1)direction=-1;
        else if(element.scrollLeft<=1)direction=1;
        element.scrollLeft=Math.max(0,Math.min(max,element.scrollLeft+direction*19*elapsed/1000));
      }
    }
    animation=requestAnimationFrame(tick);
  };
  animation=requestAnimationFrame(tick);
  handler();
  return()=>{
    active=false;observer?.disconnect();io?.disconnect();
    cancelAnimationFrame(frame);cancelAnimationFrame(animation);
    window.removeEventListener("resize",handler);
    window.removeEventListener("load",handler);
    if(element){
      element.removeEventListener("mouseenter",enter);
      element.removeEventListener("mouseleave",leave);
      element.removeEventListener("focusin",focus);
      element.removeEventListener("focusout",blur);
      element.removeEventListener("pointerdown",down);
      element.removeEventListener("pointermove",movePointer);
      element.removeEventListener("pointerup",up);
      element.removeEventListener("pointercancel",up);
      element.removeEventListener("click",click,true);
    }
  };
 },[]);
 return {track,state,sync,move};
}
export default function EditorialHighlights(){
 const news=useSlidingTrack(),creators=useSlidingTrack();
 return <div className="editorial-highlights">
  <section className="editorial-news section page-width" id="noticias" aria-labelledby="editorial-news-title">
   <div className="section-head editorial-highlight-head">
    <div><span className="eyebrow">ACTUALIDAD QUE INVITA A EXPLORAR</span><h2 id="editorial-news-title">Noticias de nuestra Venezuela.</h2></div>
    <div className="editorial-news__aside"><p>Turismo, cultura y comunidades, con fuentes y fecha de publicación.</p>
     <div className="editorial-news__controls" aria-label="Controles del carrusel de noticias">
      <button type="button" onClick={()=>news.move(-1)} disabled={!news.state.prev} aria-label="Noticias anteriores">←</button>
      <span aria-live="polite" aria-atomic="true">{news.state.index+1} / {highlights.news.length}</span>
      <button type="button" onClick={()=>news.move(1)} disabled={!news.state.next} aria-label="Siguientes noticias">→</button>
     </div>
    </div>
   </div>
   <div className="editorial-news__grid" ref={news.track} onScroll={news.sync} aria-label="Noticias de turismo" tabIndex={0}
    onKeyDown={event=>{if(event.key==="ArrowRight"){event.preventDefault();news.move(1);}if(event.key==="ArrowLeft"){event.preventDefault();news.move(-1);}}}>
    {highlights.news.map(item=><article className="editorial-news__card" key={item.id}>
     <EditorialVisual image={item.image} kind="news"/>
     <div className="editorial-news__body">
      <p className="editorial-news__meta"><time dateTime={item.date}>{dateLabel(item.date)}</time><span>· {item.source}</span></p>
      <h3><a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={"Leer noticia original: "+item.title}>{item.title}</a></h3>
      <p>{item.summary}</p>
     </div>
    </article>)}
   </div>
   <p className="editorial-highlights__note">Selección editorial revisada el {dateLabel(highlights.reviewedOn)}. Las fotos son ilustrativas y no documentan los eventos citados. Noticias enlazadas a sus fuentes; no hay actualización automática.</p>
  </section>
  <section className="editorial-creators section page-width" id="creadores" aria-labelledby="editorial-creators-title">
   <div className="section-head editorial-highlight-head">
    <div><span className="eyebrow">VOCES QUE NOS HACEN VIAJAR</span><h2 id="editorial-creators-title">Venezuela a través de sus creadores.</h2></div>
    <div className="editorial-creators__controls" aria-label="Controles del carrusel">
     <button type="button" onClick={()=>creators.move(-1)} disabled={!creators.state.prev} aria-label="Creadores anteriores">←</button>
     <span aria-live="polite" aria-atomic="true">{creators.state.index+1} / {highlights.creators.length}</span>
     <button type="button" onClick={()=>creators.move(1)} disabled={!creators.state.next} aria-label="Siguientes creadores">→</button>
    </div>
   </div>
   <div className="editorial-creators__track" ref={creators.track} onScroll={creators.sync} aria-label="Perfiles de creadores de viajes" tabIndex={0}
    onKeyDown={event=>{if(event.key==="ArrowRight"){event.preventDefault();creators.move(1);}if(event.key==="ArrowLeft"){event.preventDefault();creators.move(-1);}}}>
    {highlights.creators.map(item=><article className="editorial-creators__card" key={item.id}>
     <EditorialVisual image={item.image} kind="creators"/>
     <div className="editorial-creators__body">
      <small>{item.tag}</small><h3><a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={"Visitar perfil de "+item.name}>{item.name}</a></h3>
      <p className="editorial-creators__handle">{item.handle}</p><p>{item.focus}</p>
     </div>
    </article>)}
   </div>
   <p className="editorial-highlights__note">Selección independiente de perfiles públicos. No implica colaboración, respaldo ni afiliación. Las imágenes ilustran destinos y no son retratos de las personas mencionadas. Fotografías con fuente y licencia, sin reutilizar contenido ajeno no autorizado.</p>
  </section>
 </div>;
}
