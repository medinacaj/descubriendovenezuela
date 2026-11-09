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
 const EVIDENCE={"658":"https://whc.unesco.org/en/list/658/","701":"https://whc.unesco.org/en/list/701/","986":"https://whc.unesco.org/en/list/986/","porlamar":"https://github.com/nvkelso/natural-earth-vector/blob/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_populated_places.geojson","cumana-ciudad":"https://github.com/nvkelso/natural-earth-vector/blob/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_populated_places.geojson","ciudad-bolivar":"https://github.com/nvkelso/natural-earth-vector/blob/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_populated_places.geojson","merida-ciudad":"https://github.com/nvkelso/natural-earth-vector/blob/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_populated_places.geojson","san-cristobal":"https://github.com/nvkelso/natural-earth-vector/blob/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_populated_places.geojson","caracas-ciudad":"https://github.com/nvkelso/natural-earth-vector/blob/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_populated_places.geojson","parque-nacional-morrocoy":"https://www.inparques.gob.ve/Parques%20Nacionales/morrocoy.html","cayo-sombrero":"https://www.inparques.gob.ve/Parques%20Nacionales/morrocoy.html","parque-nacional-mochima":"https://www.inparques.gob.ve/Parques%20Nacionales/mochima.html","parque-nacional-waraira-repano":"https://www.inparques.gob.ve/Parques%20Nacionales/waraira.html","galipan":"https://www.inparques.gob.ve/Parques%20Nacionales/waraira.html","parque-nacional-henri-pittier":"https://www.inparques.gob.ve/Parques%20Nacionales/henri.html","bahia-de-cata":"https://www.inparques.gob.ve/Parques%20Nacionales/henri.html","cueva-del-guacharo":"https://www.inparques.gob.ve/Monumentos%20Nacionales/cueva-guacharo.html","morros-de-san-juan":"https://www.inparques.gob.ve/Monumentos%20Nacionales/morros-sanjuan.html","cerro-maria-lionza":"https://www.inparques.gob.ve/Monumentos%20Nacionales/maria-lionza.html","cerro-autana":"https://www.inparques.gob.ve/Monumentos%20Nacionales/cerro-autana.html","teta-de-niquitao":"https://www.inparques.gob.ve/Monumentos%20Nacionales/teta-niquitao.html","refugio-cuare":"https://www.inparques.gob.ve/Refugios/cuare.html","parque-francisco-de-miranda":"https://www.inparques.gob.ve/Parques%20de%20Recreacion/francisco-de-miranda.html","parque-los-chorros":"https://www.inparques.gob.ve/Parques%20de%20Recreacion/los-chorros.html","parque-ali-primera":"https://www.inparques.gob.ve/Parques%20de%20Recreacion/ali-primera.html","zoologico-caricuao":"https://www.inparques.gob.ve/Parques%20de%20Recreacion/caricuao.html","refugio-tortuga-arrau":"https://www.inparques.gob.ve/Refugios/tortuga-arrau.html","hacienda-chuao":"https://whc.unesco.org/en/tentativelists/1635/","casco-historico-la-guaira":"https://whc.unesco.org/en/tentativelists/1306","isla-de-plata-mochima":"https://commons.wikimedia.org/wiki/Category:Isla_de_Plata_(Mochima)","parque-nacional-tapo-caparo":"https://www.keybiodiversityareas.org/en/site/factsheet/14994/site","parque-nacional-san-esteban":"https://www.keybiodiversityareas.org/en/site/factsheet/14933/assessment","parque-nacional-tirgua":"https://www.keybiodiversityareas.org/en/site/factsheet/14969","reserva-biosfera-delta-orinoco":"https://www.unesco.org/en/mab/delta-del-orinoco","parque-nacional-yacambu":"https://musguito.net.ve/anapro/PN_Yacambu/Y4.html","parque-nacional-el-guache":"https://m.parkswatch.org/parkprofiles/pdf/gcnp_eng.pdf","relampago-del-catatumbo":"https://www.star.nesdis.noaa.gov/star/news2012_201206Catatumbo.php","parque-nacional-sierra-nevada":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-medanos-de-coro":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-archipielago-de-los-roques":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-cinaruco-capanaparo-santos-luzardo":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-peninsula-de-paria":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-dinira":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-aguaro-guariquito":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-jaua-sarisarinama":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-terepaima":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-cerro-saroche":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-guatopo":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-yurubi":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-sierra-de-la-culata":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-laguna-de-la-restinga":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-laguna-de-tacarigua":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-cerro-el-copey":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-el-tama":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-sierra-de-perija":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-sierra-de-san-luis":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-chorro-el-indio":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-yapacana":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-duida-marahuaca":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-parima-tapirapeco":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-sierra-la-neblina":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-cueva-de-la-quebrada-del-toro":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-turuepano":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-macarao":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-el-guacharo":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","parque-nacional-cienagas-del-catatumbo":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","monumento-natural-cerro-santa-ana":"https://www.inparques.gob.ve/","monumento-natural-tetas-de-maria-guevara":"https://www.inparques.gob.ve/","monumento-natural-piedra-del-cocuy":"https://www.inparques.gob.ve/","monumento-natural-cueva-alfredo-jahn":"https://www.inparques.gob.ve/","cayo-de-agua":"https://www.venezuelatuya.com/losroques/index.htm","cayo-francisqui":"https://www.venezuelatuya.com/losroques/index.htm","cayo-madrisqui":"https://www.venezuelatuya.com/losroques/index.htm","cayo-crasqui":"https://www.venezuelatuya.com/losroques/index.htm","el-gran-roque":"https://www.venezuelatuya.com/losroques/index.htm","cayo-carenero":"https://www.venezuelatuya.com/losroques/index.htm","cayo-rasqui":"https://www.venezuelatuya.com/losroques/index.htm","cayo-muerto":"https://www.venezuelatuya.com/morrocoy/chichiriviche.htm","cayo-sal":"https://www.venezuelatuya.com/morrocoy/chichiriviche.htm","cayo-peraza":"https://www.venezuelatuya.com/morrocoy/chichiriviche.htm","cayo-pelon":"https://www.venezuelatuya.com/morrocoy/chichiriviche.htm","los-juanes-morrocoy":"https://www.venezuelatuya.com/morrocoy/chichiriviche.htm","cayo-tucupido":"https://www.venezuelatuya.com/morrocoy/chichiriviche.htm","playa-el-yaque":"https://www.venezuelatuya.com/margarita/playas.htm","playa-el-agua":"https://www.venezuelatuya.com/margarita/playas.htm","playa-parguito":"https://www.venezuelatuya.com/margarita/playas.htm","playa-punta-arenas":"https://www.venezuelatuya.com/margarita/playas.htm","playa-guacuco":"https://www.venezuelatuya.com/margarita/playas.htm","playa-zaragoza":"https://www.venezuelatuya.com/margarita/playas.htm","playa-manzanillo":"https://www.venezuelatuya.com/margarita/playas.htm","playa-el-tirano":"https://www.venezuelatuya.com/margarita/playas.htm","playa-la-punta-isla-de-coche":"https://www.venezuelatuya.com/margarita/playas.htm","isla-de-coche":"https://www.venezuelatuya.com/margarita/playas.htm","isla-de-cubagua":"https://www.venezuelatuya.com/margarita/playas.htm","playa-puerto-cruz-margarita":"https://www.venezuelatuya.com/margarita/playas.htm","playa-medina":"https://publications.iadb.org/publications/spanish/document/Aprovechamiento-de-recursos-turisticos-de-Venezuela-para-su-puesta-en-valor-la-Gran-Sabana-y-la-Peninsula-de-Paria.pdf","playa-pui-pui":"https://publications.iadb.org/publications/spanish/document/Aprovechamiento-de-recursos-turisticos-de-Venezuela-para-su-puesta-en-valor-la-Gran-Sabana-y-la-Peninsula-de-Paria.pdf","playa-querepare":"https://publications.iadb.org/publications/spanish/document/Aprovechamiento-de-recursos-turisticos-de-Venezuela-para-su-puesta-en-valor-la-Gran-Sabana-y-la-Peninsula-de-Paria.pdf","playa-caracolito-paria":"https://publications.iadb.org/publications/spanish/document/Aprovechamiento-de-recursos-turisticos-de-Venezuela-para-su-puesta-en-valor-la-Gran-Sabana-y-la-Peninsula-de-Paria.pdf","san-juan-de-las-galdonas":"https://publications.iadb.org/publications/spanish/document/Aprovechamiento-de-recursos-turisticos-de-Venezuela-para-su-puesta-en-valor-la-Gran-Sabana-y-la-Peninsula-de-Paria.pdf","playa-cuyagua":"https://venezuelatuya.com/centro/costas_de_aragua.htm","playa-grande-de-choroni":"https://venezuelatuya.com/centro/costas_de_aragua.htm","playa-cepe":"https://venezuelatuya.com/centro/costas_de_aragua.htm","playa-tuja":"https://venezuelatuya.com/centro/costas_de_aragua.htm","la-cienaga-de-ocumare":"https://venezuelatuya.com/centro/costas_de_aragua.htm","playa-de-chuao":"https://venezuelatuya.com/centro/costas_de_aragua.htm","laguna-de-mucubaji":"https://viajacongus.com/venezuela/","pico-bolivar":"https://viajacongus.com/venezuela/","pico-el-aguila":"https://viajacongus.com/venezuela/","valle-de-los-nevados":"https://viajacongus.com/venezuela/","renaissance-caracas-la-castellana-hotel":"https://www.marriott.com/es/destinations/venezuela.mi","jw-marriott-hotel-caracas":"https://www.marriott.com/es/destinations/venezuela.mi","venezuela-marriott-hotel-playa-grande":"https://www.marriott.com/es/destinations/venezuela.mi","marriott-maracay-golf-resort":"https://www.marriott.com/es/destinations/venezuela.mi","sunsol-isla-caribe":"https://www.sunsolhoteles.com/pages/ubicacion.php","sunsol-punta-blanca":"https://www.sunsolhoteles.com/pages/ubicacion.php","sunsol-ecoland":"https://www.sunsolhoteles.com/pages/ubicacion.php","sunsol-unik":"https://www.sunsolhoteles.com/pages/ubicacion.php","hotel-humboldt":"https://hotelhumboldt.net/","sambil-chacao-caracas":"https://gruposambil.com/es/centros-comerciales/","sambil-la-candelaria":"https://gruposambil.com/es/centros-comerciales/","sambil-maracaibo":"https://gruposambil.com/es/centros-comerciales/","sambil-valencia":"https://gruposambil.com/es/centros-comerciales/","sambil-margarita":"https://gruposambil.com/es/centros-comerciales/","sambil-san-cristobal":"https://gruposambil.com/es/centros-comerciales/","sambil-barquisimeto":"https://gruposambil.com/es/centros-comerciales/","sambil-paraguana":"https://gruposambil.com/es/centros-comerciales/","casa-natal-del-libertador-simon-bolivar":"https://cneh.gob.ve/museo-casa-natal-del-libertador/","teatro-baralt":"https://www.teatrobaralt.org/","pampatar":"https://www.venezuelatuya.com/margarita/index.htm","la-asuncion":"https://www.venezuelatuya.com/margarita/index.htm","juan-griego":"https://www.venezuelatuya.com/margarita/index.htm","el-valle-del-espiritu-santo":"https://www.venezuelatuya.com/margarita/index.htm","peninsula-de-macanao":"https://www.venezuelatuya.com/margarita/index.htm","pedro-gonzalez":"https://www.venezuelatuya.com/margarita/index.htm","museo-de-bellas-artes-de-caracas":"https://www.venezuelatuya.com/caracas/museos_de_caracas.htm","museo-de-arte-contemporaneo-de-caracas":"https://www.venezuelatuya.com/caracas/museos_de_caracas.htm","galeria-de-arte-nacional":"https://www.venezuelatuya.com/caracas/museos_de_caracas.htm","museo-de-los-ninos-de-caracas":"https://www.venezuelatuya.com/caracas/museos_de_caracas.htm","museo-de-arte-colonial-quinta-de-anauco":"https://www.venezuelatuya.com/caracas/museos_de_caracas.htm","museo-de-la-estampa-y-del-diseno-carlos-cruz-diez":"https://www.venezuelatuya.com/caracas/museos_de_caracas.htm","museo-bolivariano-de-caracas":"https://www.venezuelatuya.com/caracas/museos_de_caracas.htm","museo-del-transporte-guillermo-jose-schael":"https://www.venezuelatuya.com/caracas/museos_de_caracas.htm","museo-de-ciencias-de-caracas":"https://venezuelatuya.com/estados/distrito_capital.htm","complejo-cultural-teresa-carreno":"https://www.venezuelatuya.com/caracas/teatro_teresa_carreno.htm","panteon-nacional-de-venezuela":"https://venezuelatuya.com/estados/distrito_capital.htm","plaza-bolivar-de-caracas":"https://venezuelatuya.com/estados/distrito_capital.htm","parque-los-caobos":"https://venezuelatuya.com/estados/distrito_capital.htm","parque-ezequiel-zamora-el-calvario":"https://venezuelatuya.com/estados/distrito_capital.htm","plaza-venezuela":"https://venezuelatuya.com/estados/distrito_capital.htm","plaza-o-leary":"https://venezuelatuya.com/estados/distrito_capital.htm","quebrada-de-jaspe":"https://www.visitvenezuela.travel/destinos/gran-sabana","salto-kama-meru":"https://www.visitvenezuela.travel/destinos/gran-sabana","salto-mauraik":"https://www.visitvenezuela.travel/destinos/gran-sabana","san-francisco-de-yuruani":"https://www.visitvenezuela.travel/destinos/gran-sabana","la-gran-sabana":"https://www.visitvenezuela.travel/destinos/gran-sabana","obelisco-de-barquisimeto":"https://www.venezuelatuya.com/occidente/barquisimeto.htm","flor-de-venezuela":"https://www.venezuelatuya.com/occidente/barquisimeto.htm","santa-rosa-de-barquisimeto":"https://www.venezuelatuya.com/occidente/barquisimeto.htm","manto-de-maria-divina-pastora":"https://www.venezuelatuya.com/occidente/barquisimeto.htm","ruta-artesanal-tintorero-y-quibor":"https://www.venezuelatuya.com/occidente/barquisimeto.htm","cascada-del-vino":"https://www.venezuelatuya.com/occidente/","peninsula-de-paraguana":"https://www.venezuelatuya.com/occidente/","pueblo-de-choroni":"https://www.venezuelatuya.com/centro/choroni.htm","puerto-colombia":"https://www.venezuelatuya.com/centro/choroni.htm","mercado-municipal-de-chacao":"https://mercadomunicipaldechacao.com.ve/","la-cuadra-gastronomica":"https://www.elfogoncreativo.com/cada-cena-es-distinta-en-cocina-restaurante/","centro-historico-de-el-hatillo":"https://iamvenezuela.org/2017/01/centro-historico-de-el-hatillo/","paseo-el-hatillo":"https://paseoelhatillo.com/gastronomia/","ruta-de-las-fresas-con-crema-de-la-culata":"https://apartamentosturisticosmerida.com/plan-viaje-ruta-de-la-culata.html","paramo-de-la-culata":"https://apartamentosturisticosmerida.com/plan-viaje-ruta-de-la-culata.html","palafitos-de-santa-rosa-de-agua":"https://comunidadactivanoticias.com/maracaibo/tranvia-de-maracaibo-realizo-recorrido-turistico-por-los-palafitos-de-santa-rosa-de-agua/","ruta-de-los-palafitos-de-maracaibo":"https://comunidadactivanoticias.com/maracaibo/tranvia-de-maracaibo-realizo-recorrido-turistico-por-los-palafitos-de-santa-rosa-de-agua/","mercado-de-conejeros":"https://www.venezuelatuya.com/margarita/index.htm","castillo-de-san-carlos-de-borromeo":"https://www.venezuelatuya.com/margarita/index.htm","castillo-de-santa-rosa-de-la-asuncion":"https://www.venezuelatuya.com/margarita/index.htm","tobogan-de-la-selva":"https://www.mintur.gob.ve/documents/viajandos/Qu3yIpEBBwwMwrPJ1K2IgaZU75hqCTZ4tFiKuPht.pdf","pozo-azul-de-calderas":"https://www.mintur.gob.ve/documents/viajandos/Qu3yIpEBBwwMwrPJ1K2IgaZU75hqCTZ4tFiKuPht.pdf","piedra-de-la-virgen-gran-sabana":"https://www.mintur.gob.ve/documents/viajandos/Qu3yIpEBBwwMwrPJ1K2IgaZU75hqCTZ4tFiKuPht.pdf","cascadas-de-manakachi":"https://www.mintur.gob.ve/documents/viajandos/d7FxE1SzGvRNXehYZw6DOvmKq2etygYscDQl5Qj3.pdf","parque-de-la-exotica-flora-tropical":"https://www.mintur.gob.ve/documents/viajandos/d7FxE1SzGvRNXehYZw6DOvmKq2etygYscDQl5Qj3.pdf","parque-ecoturistico-aguas-calientes-azulita":"https://www.mintur.gob.ve/documents/viajandos/d7FxE1SzGvRNXehYZw6DOvmKq2etygYscDQl5Qj3.pdf","cumbres-del-palenque":"https://laraturismo.com/sitios/index.html","petroglifos-de-tumaque":"https://laraturismo.com/sitios/index.html","cueva-el-indio-duaca":"https://laraturismo.com/sitios/index.html","cueva-poma-rosa":"https://laraturismo.com/sitios/index.html","represa-dos-cerritos":"https://laraturismo.com/sitios/index.html","lomas-de-cubiro":"https://www.mintur.gob.ve/news/9f67f7ef-2a7b-4f30-a908-080e941943b7","cueva-de-los-carraos":"https://www.mintur.gob.ve/news/9f67f7ef-2a7b-4f30-a908-080e941943b7","cerro-la-bandera-cubiro":"https://www.mintur.gob.ve/news/9f67f7ef-2a7b-4f30-a908-080e941943b7","laguna-el-blanquito":"https://www.mintur.gob.ve/news/9f67f7ef-2a7b-4f30-a908-080e941943b7","catedral-metropolitana-barquisimeto":"https://camaradeturismodelara.com/","basilica-santa-rosa-barquisimeto":"https://camaradeturismodelara.com/","petroglifos-de-vigirima":"https://eldiario.com/2025/03/20/redescubriendo-venezuela-10-destinos-turisticos-poco-conocidos-en-el-pais/","cuevas-del-zumbador":"https://eldiario.com/2025/03/20/redescubriendo-venezuela-10-destinos-turisticos-poco-conocidos-en-el-pais/","playa-el-supi":"https://eldiario.com/2025/03/20/redescubriendo-venezuela-10-destinos-turisticos-poco-conocidos-en-el-pais/","san-pedro-del-rio":"https://eldiario.com/2025/03/20/redescubriendo-venezuela-10-destinos-turisticos-poco-conocidos-en-el-pais/","cienaga-de-los-olivitos":"https://eldiario.com/2025/03/20/redescubriendo-venezuela-10-destinos-turisticos-poco-conocidos-en-el-pais/","el-pauji-gran-sabana":"https://eldiario.com/2025/03/20/redescubriendo-venezuela-10-destinos-turisticos-poco-conocidos-en-el-pais/","santuario-nacional-nuestra-senora-de-coromoto":"https://mrsvenezuela.com/estado/portuguesa","guanare-centro-historico":"https://mrsvenezuela.com/estado/portuguesa","basilica-catedral-coromoto-guanare":"https://www.mintur.gob.ve/documents/viajandos/C9kKDgn4nMPbl49XuuknGh4Ndzo0QUfTF5Ajfh0D.pdf","iglesia-nuestra-senora-del-pilar-araure":"https://mrsvenezuela.com/estado/portuguesa","monumento-la-espiga-acarigua":"https://mrsvenezuela.com/estado/portuguesa","jacuzzis-de-la-lucia":"https://elaragueno.com.ve/los-jacuzzis-de-la-lucia-son-el-secreto-de-portuguesa/","casa-museo-la-blanquera":"https://mrsvenezuela.com/estado/cojedes","balneario-boca-toma":"https://mrsvenezuela.com/estado/cojedes","arco-de-taguanes":"https://mrsvenezuela.com/estado/cojedes","catedral-inmaculada-concepcion-san-carlos":"https://mrsvenezuela.com/estado/cojedes","isnotu":"https://www.mintur.gob.ve/news/9fb0b4c7-746b-44f5-a1cd-8c10dc1555c9","santuario-del-nino-jesus-isnotu":"https://www.mintur.gob.ve/news/9fb0b4c7-746b-44f5-a1cd-8c10dc1555c9","santuario-dulce-nombre-de-jesus-escunque":"https://www.mintur.gob.ve/index.php/news/a0576aea-cb5d-4dac-a9fc-41e1e507da26","monumento-virgen-de-la-paz":"https://www.mintur.gob.ve/documents/viajandos/C9kKDgn4nMPbl49XuuknGh4Ndzo0QUfTF5Ajfh0D.pdf","museo-trapiche-de-los-clavos":"https://www.mintur.gob.ve/documents/viajandos/C9kKDgn4nMPbl49XuuknGh4Ndzo0QUfTF5Ajfh0D.pdf","casa-de-la-estrella-valencia":"https://www.mintur.gob.ve/documents/viajandos/C9kKDgn4nMPbl49XuuknGh4Ndzo0QUfTF5Ajfh0D.pdf","meseta-de-la-galera":"https://www.mintur.gob.ve/documents/viajandos/C9kKDgn4nMPbl49XuuknGh4Ndzo0QUfTF5Ajfh0D.pdf","iglesia-san-francisco-caracas":"https://www.mintur.gob.ve/documents/viajandos/C9kKDgn4nMPbl49XuuknGh4Ndzo0QUfTF5Ajfh0D.pdf","casa-guipuzcoana-la-guaira":"https://www.mintur.gob.ve/documents/viajandos/C9kKDgn4nMPbl49XuuknGh4Ndzo0QUfTF5Ajfh0D.pdf","parque-historico-san-felipe-el-fuerte":"https://www.mintur.gob.ve/documents/viajandos/C9kKDgn4nMPbl49XuuknGh4Ndzo0QUfTF5Ajfh0D.pdf","casa-de-los-poetas-barinas":"https://www.mintur.gob.ve/documents/viajandos/C9kKDgn4nMPbl49XuuknGh4Ndzo0QUfTF5Ajfh0D.pdf","monumento-a-marisela-apure":"https://www.mintur.gob.ve/documents/viajandos/C9kKDgn4nMPbl49XuuknGh4Ndzo0QUfTF5Ajfh0D.pdf","playa-chuspa":"https://www.mintur.gob.ve/news/a272b4ac-4106-4b19-89e9-f2006c0e74dc","playa-todasana":"https://www.mintur.gob.ve/news/a276b8e3-ceea-4e2c-8186-92a23921ad5f","playa-osma":"https://www.mintur.gob.ve/news/a276b8e3-ceea-4e2c-8186-92a23921ad5f","chichiriviche-de-la-costa":"https://www.mintur.gob.ve/news/a272b4ac-4106-4b19-89e9-f2006c0e74dc","paseo-macuto":"https://www.mintur.gob.ve/news/a276b8e3-ceea-4e2c-8186-92a23921ad5f","playa-camuri-chico":"https://www.mintur.gob.ve/news/a272b4ac-4106-4b19-89e9-f2006c0e74dc","playa-los-caracas":"https://www.mintur.gob.ve/news/a272b4ac-4106-4b19-89e9-f2006c0e74dc","playa-anare":"https://www.mintur.gob.ve/news/a272b4ac-4106-4b19-89e9-f2006c0e74dc","playa-taguao":"https://www.mintur.gob.ve/news/a272b4ac-4106-4b19-89e9-f2006c0e74dc","playa-las-salinas-la-guaira":"https://www.mintur.gob.ve/news/a272b4ac-4106-4b19-89e9-f2006c0e74dc","playa-el-yate-la-guaira":"https://www.mintur.gob.ve/news/a272b4ac-4106-4b19-89e9-f2006c0e74dc","playa-caroao":"https://www.mintur.gob.ve/news/a272b4ac-4106-4b19-89e9-f2006c0e74dc","museo-santuario-jeronimo-trujillo":"https://www.mintur.gob.ve/news/9fb0b4c7-746b-44f5-a1cd-8c10dc1555c9","rio-morichal-largo":"https://www.mintur.gob.ve/news/9f924c89-5d70-4d4b-abdd-655659a48f14","salto-el-chorreron-monagas":"https://www.mintur.gob.ve/news/9f924c89-5d70-4d4b-abdd-655659a48f14","cerro-negro-monagas":"https://www.mintur.gob.ve/news/9f924c89-5d70-4d4b-abdd-655659a48f14","cascada-del-nazareno-monagas":"https://www.mintur.gob.ve/news/9f924c89-5d70-4d4b-abdd-655659a48f14","isla-puinare-mochima":"https://www.mintur.gob.ve/news/9e585096-0e92-4e33-9513-90b842c3eb85","el-faro-mochima":"https://www.mintur.gob.ve/news/9e585096-0e92-4e33-9513-90b842c3eb85","punta-la-cruz-mochima":"https://www.mintur.gob.ve/news/9e585096-0e92-4e33-9513-90b842c3eb85","ciudad-orinoco":"https://www.mintur.gob.ve/news/a130cdf3-593e-48ad-ac29-f4a13f9e9c5e","colonia-tovar":"https://www.mintur.gob.ve/news/a17f32a8-5576-4c0f-b428-be03c1ab43ec","iglesia-san-martin-de-tours-colonia-tovar":"https://www.mintur.gob.ve/news/a17f32a8-5576-4c0f-b428-be03c1ab43ec","jardin-de-las-hortensias-colonia-tovar":"https://www.mintur.gob.ve/news/a17f32a8-5576-4c0f-b428-be03c1ab43ec","monumento-natural-pico-codazzi":"https://www.mintur.gob.ve/news/a17f32a8-5576-4c0f-b428-be03c1ab43ec","la-victoria-aragua":"https://www.mintur.gob.ve/documents/tramites/pnt/NUEVO_FORMATO_NOMINADOS.pdf","centro-historico-la-victoria":"https://www.mintur.gob.ve/documents/tramites/pnt/NUEVO_FORMATO_NOMINADOS.pdf","la-grita-tachira":"https://www.mintur.gob.ve/documents/tramites/pnt/NUEVO_FORMATO_NOMINADOS.pdf","ruta-paramos-magicos-capacho":"https://www.mintur.gob.ve/documents/tramites/pnt/NUEVO_FORMATO_NOMINADOS.pdf","cueva-del-fantasma":"https://eldiario.com/2025/03/20/redescubriendo-venezuela-10-destinos-turisticos-poco-conocidos-en-el-pais/","piedra-abuela-kueka":"https://www.mintur.gob.ve/documents/tramites/pnt/NUEVO_FORMATO_NOMINADOS.pdf","puente-de-angostura":"https://www.mintur.gob.ve/news/a130cdf3-593e-48ad-ac29-f4a13f9e9c5e","salto-la-vaca-el-pauji":"https://eldiario.com/2025/03/20/redescubriendo-venezuela-10-destinos-turisticos-poco-conocidos-en-el-pais/","hato-el-cedral":"https://www.mintur.gob.ve/news/a085653e-b012-4f43-ba24-2768b6afe014","playa-adicora":"https://www.mintur.gob.ve/news/9eb4ab4c-1846-4b89-ab0e-8b08f3160383","playa-mata-gorda-paraguana":"https://www.mintur.gob.ve/news/9eb4ab4c-1846-4b89-ab0e-8b08f3160383","playa-villa-marina":"https://www.mintur.gob.ve/news/9eb4ab4c-1846-4b89-ab0e-8b08f3160383","playa-amuay":"https://www.mintur.gob.ve/news/9eb4ab4c-1846-4b89-ab0e-8b08f3160383","playa-bahia-grande-paraguana":"https://www.mintur.gob.ve/news/9eb4ab4c-1846-4b89-ab0e-8b08f3160383","playa-lido":"https://www.mintur.gob.ve/news/9e56b7c8-5047-49b1-b227-59f9068ddfcb","cano-grulla":"https://www.mintur.gob.ve/news/a03ed737-eeb4-4cff-bf46-b40b5c06ac4f","pozo-labio-grueso":"https://www.mintur.gob.ve/news/a03ed737-eeb4-4cff-bf46-b40b5c06ac4f","ruta-legado-del-budare-amazonas":"https://www.mintur.gob.ve/news/a03ed737-eeb4-4cff-bf46-b40b5c06ac4f","cueva-juata-aje-amazonas":"https://www.mintur.gob.ve/news/a03ed737-eeb4-4cff-bf46-b40b5c06ac4f","kamarata":"https://www.mintur.gob.ve/news/a004c0b5-d9b6-4bcb-9162-1e792cfa41f0","pozo-azul-amazonas":"https://www.mintur.gob.ve/news/9f597e27-fe28-4600-8cc4-278f9785d0f1","basilica-santa-teresa-caracas":"https://www.mintur.gob.ve/news/a17b8463-4a65-402a-8745-d0859ac78557","rio-caribe":"https://www.mintur.gob.ve/news/9f55914f-3377-4336-a4be-1e2b4fbbc732","carupano":"https://www.mintur.gob.ve/news/a10c3f87-56e1-4537-bd2f-aa901072a540","guiria":"https://www.mintur.gob.ve/news/a11823b3-ba64-4e6e-9321-4dea7cfe1301","bocono":"https://www.mintur.gob.ve/news/a11823b3-ba64-4e6e-9321-4dea7cfe1301","el-callao":"https://www.mintur.gob.ve/news/a11823b3-ba64-4e6e-9321-4dea7cfe1301","guanare":"https://www.mintur.gob.ve/news/a11823b3-ba64-4e6e-9321-4dea7cfe1301","la-vela-de-coro":"https://whc.unesco.org/en/list/658","cabo-san-roman":"https://www.mintur.gob.ve/news/a17f0021-6b61-4b33-9023-ee824e3c3907","haiton-del-guarataro":"https://www.mintur.gob.ve/news/a17f0021-6b61-4b33-9023-ee824e3c3907","museo-arte-moderno-jesus-soto":"https://jesus-soto.com/es/museo-soto/","parque-recreacional-rafael-montano":"https://www.mintur.gob.ve/news/a10c3f87-56e1-4537-bd2f-aa901072a540","isla-de-aves-refugio":"https://inparques.gob.ve/Refugios/isla-aves.html","parque-nacional-guaramacal":"https://wiki.openstreetmap.org/wiki/ES:Venezuela/Listados/Parques_nacionales","museo-historico-general-rafael-urdaneta":"https://www.mintur.gob.ve/index.php/news/a06b2c93-7808-4c59-8818-507922b1d29e","parque-general-rafael-urdaneta":"https://www.mintur.gob.ve/index.php/news/a06b2c93-7808-4c59-8818-507922b1d29e","basilica-chiquinquira-maracaibo":"https://www.mintur.gob.ve/index.php/news/a06b2c93-7808-4c59-8818-507922b1d29e","casa-de-la-capitulacion-maracaibo":"https://www.mintur.gob.ve/index.php/news/a06b2c93-7808-4c59-8818-507922b1d29e","centro-de-arte-lia-bermudez":"https://www.mintur.gob.ve/index.php/news/a06b2c93-7808-4c59-8818-507922b1d29e","plaza-baralt-maracaibo":"https://www.mintur.gob.ve/index.php/news/a06b2c93-7808-4c59-8818-507922b1d29e","parque-zoologico-la-guaricha":"https://www.mintur.gob.ve/news/9e6a4e65-3a8f-4c86-85e3-3632c3880e52","catedral-de-maturin":"https://www.mintur.gob.ve/news/9e6a4e65-3a8f-4c86-85e3-3632c3880e52","iglesia-san-simon-maturin":"https://www.mintur.gob.ve/news/9e6a4e65-3a8f-4c86-85e3-3632c3880e52","casa-aduana-maturin":"https://www.mintur.gob.ve/news/9e6a4e65-3a8f-4c86-85e3-3632c3880e52","embalse-masparro":"https://www.mintur.gob.ve/news/9fac12b3-a1f6-429b-a19d-4cf2a84b4579","calle-carabobo-maracaibo":"https://www.mintur.gob.ve/index.php/news/a0612b4c-2c0d-4cd5-8103-76c917aad046","parque-la-marina-maracaibo":"https://www.mintur.gob.ve/index.php/news/a0612b4c-2c0d-4cd5-8103-76c917aad046","los-ranchos-de-chano":"https://www.losranchosdechano.com/","posada-casa-sol-merida":"https://www.posadacasasol.com.ve/","posada-rafaela-y-cristobal":"https://www.posadarafaelaycristobal.com/","posada-los-cocos-morrocoy":"https://www.posadaloscocos.com/la-posada","posada-la-ardilena":"https://ardilena.com/","posada-playa-colorada":"https://playacoloradaposada.com/habitaciones/","posada-neneko-mochima":"https://turismosucre.com.ve/alojamiento/mochima/","posada-los-siete-delfines":"https://turismosucre.com.ve/alojamiento/mochima/","posada-la-guarandinga":"https://turismosucre.com.ve/alojamiento/cariaco/","posada-el-portal-de-los-suenos":"https://turismosucre.com.ve/alojamiento/cariaco/","posada-sol-luna-y-estrellas":"https://luiscastellanos.org/posada-sol-luna-estrellas-boca-uchire-venezuela/","estancia-altos-de-veracruz":"https://www.findglocal.com/VE/Sanare/619866644767690/Altos-de-Veracruz","finca-la-floresta-caripe":"https://gelvez.com.ve/caripe/posadas/","posada-paraiso-guisela":"https://posada-paraiso.com/","posada-casa-el-pozo":"https://lacasaelpozo.com/index.php","posada-la-fuente-margarita":"https://posadalafuente.wixsite.com/index","museo-de-los-ninos-caracas":"https://maravillosarealidad.com/","parque-la-venezuela-de-antier":"https://www.meridachevere.com/item/la-venezuela-de-antier/","parque-la-montana-de-los-suenos":"https://www.meridachevere.com/item/la-montana-de-los-suenos/","pueblo-museo-los-aleros":"https://www.meridachevere.com/item/los-aleros/"};
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