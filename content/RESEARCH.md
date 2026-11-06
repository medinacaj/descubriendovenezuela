# Registro de investigación del directorio

Consulta: 4 de noviembre de 2026. Responsable de compilación: asistente en esta sesión, por solicitud del usuario. No hubo visita de campo ni validación de horarios, accesos, precios o condiciones de seguridad.

## Primera carga: tres lugares patrimoniales

### Búsqueda y fuentes realmente leídas

Búsqueda web en GitHub: https://github.com/search?q=world-heritage-sites&type=repositories

1. Catálogo de Brandon Himpfen, `country`, versión `ce6e2deff0c325b972514b3366d3ee94323c8ee9`: https://github.com/brandonhimpfen/unesco-world-heritage-sites/blob/ce6e2deff0c325b972514b3366d3ee94323c8ee9/country . La sección Venezuela enumera Coro and its Port, Canaima National Park y Ciudad Universitaria de Caracas. Se usaron solo nombres factuales, no descripciones o imágenes.
2. Richard Iannone, UWHS, versión `4b05bf5f2813bcf66a744a9963567bc856c2a33e`, archivo `data/uwhs.rda`: https://github.com/rich-iannone/UWHS/tree/4b05bf5f2813bcf66a744a9963567bc856c2a33e . Datos declarados de la auditoría 2014, no actuales. Se leyó el RDA: ref_no 658/Coro/cultural/1993/ve; 701/Canaima/natural/1994/ve; 986/Ciudad Universitaria/cultural/2000/ve. Licencia MIT y copyright preservados en UWHS-LICENSE.txt. Se utilizaron nombres, categorías y años históricos; no se reutilizaron coordenadas, superficies ni estado de peligro histórico como si fueran actuales.

Las fuentes secundarias comparten probablemente origen UNESCO: el contraste confirma consistencia de identificación, no dos verificaciones de campo independientes. Los textos en español son resúmenes originales limitados a esos hechos.

## Fuentes oficiales pendientes

Intentos directos a https://whc.unesco.org/en/list/701/ , /658/ y /986/ bloqueados por el proxy con HTTP 403/CONNECT. Inparques no se consultó. El borrador de configuración devolvió `draft_not_editable` al proponer permitir whc.unesco.org y www.inparques.gob.ve; no se confirmó actualización de red. Los enlaces UNESCO se ofrecen como referencias oficiales **no consultadas directamente**.

## Lo que se publica y lo que no

`places.json` es el catálogo versionado de la vista pública GitHub Pages. La primera carga tuvo tres sitios patrimoniales, sin fotos, coordenadas, precios, horarios ni contactos inventados. La ampliación descrita abajo añade seis localidades y sus mapas. La app Next/PostgreSQL conserva su base local de demostración; no se han importado estos registros como fichas operativamente verificadas.

La jerarquía administrativa exacta no se inventa: las fichas se ubican solo en Venezuela hasta documentarla. Los marcadores y rutas no se muestran. El antiguo contenido sintético se sustituye en Pages; los fixtures exclusivos de prueba permanecen fuera de este catálogo.

Regenerar la página desde la raíz con `node scripts/build-pages.mjs`. No editar docs/index.html manualmente. La vista pública usa hashes para rutas compatibles con Pages; la búsqueda y los filtros son locales. El panel editorial pertenece a la app con servidor y se explica como no disponible aquí.


## Ampliación: seis localidades y seis imágenes cartográficas

Estado actual: **nueve lugares documentados, seis mapas de referencia y ninguna fotografía de destino incorporada**. Se añadieron Mérida, Cumaná, Ciudad Bolívar, Porlamar, San Cristóbal y Caracas, como localidades, no como negocios turísticos o atractivos comprobados.

Fuente primaria cartográfica realmente leída: [Natural Earth, localidades](https://github.com/nvkelso/natural-earth-vector/blob/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_populated_places.geojson), versión `ca96624a56bd078437bca8184e78163e5039ad19`. Se documentaron nombre, país y entidad de primer nivel. Las descripciones se limitan a esos hechos y a la función de la ficha. No prueban apertura de servicios ni visitas actuales.

[Registro ampliado con evidencia](EXPANSION-RESEARCH.json): campos leídos, versiones, alcance, candidatos de hospedaje no publicados y razones de exclusión. Las webs encontradas en repositorios de desarrolladores no se tomaron como prueba suficiente de negocios operativos; algunos eran ejercicios o maquetas. No se añadieron como posadas verificadas.

### Procedencia de las imágenes

Las seis imágenes de `docs/media/` **son mapas esquemáticos, no fotografías**. Se renderizaron localmente desde [Natural Earth, entidades de primer nivel](https://github.com/nvkelso/natural-earth-vector/blob/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_admin_1_states_provinces.geojson). Se resaltó el estado o distrito de cada localidad; no se colocaron marcadores de establecimientos ni puntos exactos de visita. Datos de dominio público: licencia y créditos preservados en [maps/NATURAL-EARTH-LICENSE.md](maps/NATURAL-EARTH-LICENSE.md). Cada ficha y tarjeta enlaza origen y licencia, identifica «Cartografía» y advierte límites generalizados no oficiales. No usar para navegación ni delimitación territorial.

La copia mínima de geometrías usada está en `maps/states.geojson`; los SVG fuente y la tabla de regiones también se conservan. `scripts/build-maps.mjs` genera los WebP locales. Las imágenes no dependen de hotlinks ni de servicios externos.

### Investigación de fotografías y nuevo intento de acceso

Se revisaron repositorios CanaimaGNULinuxArchivo/canaima-desktop-base y canaima-estilo-visual-gnome, el archivo 392781/mint-backgrounds (créditos de fotografías) y elementary/wallpapers (debian/copyright). No se obtuvo una fotografía que combinara identificación verificable de un destino venezolano y permiso de reutilización documentado. Las fotos sin localización comprobable, material de interfaz y fotos ajenas de proyectos sin licencia se descartaron.

Se reintentaron Posadaven, Venezuela Tuya y Wikimedia Commons por solicitud del usuario. El acceso continúa restringido por la política de red; no se presenta como una consulta exitosa a esos sitios. Las fotos de destino y los hospedajes contrastados siguen pendientes; los mapas no se hacen pasar por esas fotografías.

### Reproducción

`npm run build:maps` regenera las imágenes a partir de las fuentes guardadas; `npm run build:pages` valida el catálogo y los archivos, y genera Pages. `npm run test:pages` comprueba imágenes servidas bajo la ruta del proyecto, filtros por categoría/región, búsqueda sin acentos, detalle y licencia en móvil y escritorio. La aplicación Next/PostgreSQL mantiene su catálogo local de demostración separado.


## Segunda consulta — UNESCO directo (6 de noviembre de 2026)

Esta revisión complementa y sustituye la limitación de red de la primera consulta del 4 de noviembre. Se leyeron en línea las fichas oficiales del Centro del Patrimonio Mundial de UNESCO: https://whc.unesco.org/en/list/701/ (Canaima), https://whc.unesco.org/en/list/658/ (Coro y su Puerto) y https://whc.unesco.org/en/list/986/ (Ciudad Universitaria de Caracas). Los hechos históricos, la región y las características patrimoniales de estas tres fichas se resumieron con redacción original y ahora incluyen la fuente primaria como primera referencia. No se copiaron imágenes ni descripciones extensas.

Esta consulta no verifica apertura al público, seguridad, accesos, transporte, tarifas ni horarios. No se han obtenido autorizaciones de fotografías, reseñas o contactos comerciales. Se conserva el historial de la primera consulta, que usó dos fuentes secundarias.
