/** Cada imagen es propia o se identifica como referencia de un lugar distinto. */
export function createVisualResolver(places){
 const photos=places.filter(p=>p.photos?.some(x=>x.kind==="photograph"));
 const byId=new Map(places.map(p=>[p.id,p])),byRegion=new Map();
 for(const p of photos)byRegion.set(p.region,[...(byRegion.get(p.region)||[]),p]);
 const sea=/playa|cayo|isla|mar|costa|bahía|laguna|archipiélago|pampatar|morrocoy|roques|paria/i;
 const urban=/museo|teatro|centro comercial|sambil|mercado|hotel|panteón|plaza|galería|casa natal|basílica|santuario/i;
 const anchors={"Nueva Esparta":"isla-de-plata-mochima","Dependencias Federales":"cayo-sombrero","Mérida":"parque-nacional-san-esteban","Táchira":"parque-nacional-san-esteban","Trujillo":"parque-nacional-san-esteban","Apure":"morros-de-san-juan","Barinas":"morros-de-san-juan","Cojedes":"morros-de-san-juan","Portuguesa":"parque-nacional-yacambu","Yaracuy":"parque-nacional-henri-pittier"};
 return function visualFor(p){
  const own=p.photos?.find(x=>x.kind==="photograph")||p.photos?.[0];
  if(own)return{asset:own,sourcePlace:p,representative:false};
  const possible=byRegion.get(p.region)||[];
  const score=x=>(sea.test(p.name)&&sea.test(x.name)?12:0)+(urban.test(p.name)&&["Cultura","Localidades"].includes(x.category)?9:0)+(x.category===p.category?5:0);
  let other=[...possible].sort((a,b)=>score(b)-score(a))[0];
  if(!other)other=byId.get(anchors[p.region])||byId.get(sea.test(p.name)?"cayo-sombrero":urban.test(p.name)?"986":"parque-nacional-henri-pittier");
  let asset=other?.photos?.find(x=>x.kind==="photograph");
  if(!asset){other=photos[0];asset=other?.photos.find(x=>x.kind==="photograph");}
  if(!asset)throw Error("No se encontró fotografía auditada");
  return{asset,sourcePlace:other,representative:true};
 };
}
