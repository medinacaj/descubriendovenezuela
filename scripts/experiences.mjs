// Etiquetas orientativas derivadas de la categoría y el nombre/documentación del lugar.
// No implican apertura, accesibilidad, rutas seguras ni actividades disponibles.
export const experienceOptions=[
  {id:"playas",label:"Playas"},
  {id:"montanas",label:"Montañas"},
  {id:"parques",label:"Parques"},
  {id:"cultura",label:"Cultura"},
  {id:"sabores",label:"Gastronomía"},
  {id:"posadas",label:"Posadas"}
];
const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
export function experiencesFor(p){
  const category=p.category, name=norm(p.name),info=norm(p.name+" "+p.description);
  const out=[];
  if(category==="Naturaleza"){
    if(/\b(playa|playas|cayo|cayos|isla|islas|archipielago|bahia|balneario|morrocoy|mochima|manglar|costa|costera|corales|marino)\b/.test(info))out.push("playas");
    if(/\b(montana|montanas|sierra|cordillera|pico|picos|nevado|nevada|tepuy|tepuyes|paramo|paramos|cerro|cerros|cumbre|cumbres|morros|altiplano)\b/.test(info))out.push("montanas");
    if(/\b(parque|reserva|refugio|monumento|bosque|selva|santuario|humedal)\b/.test(name))out.push("parques");
  }
  if(category==="Cultura")out.push("cultura");
  if(category==="Gastronomía")out.push("sabores");
  if(category==="Hospedaje")out.push("posadas");
  return [...new Set(out)];
}
