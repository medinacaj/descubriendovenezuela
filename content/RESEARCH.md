# Primer catálogo documental de lugares reales

Consulta: 4 de noviembre de 2026. Responsable de compilación: asistente en esta sesión, por solicitud del usuario. No hubo visita de campo ni validación de horarios, accesos, precios o condiciones de seguridad.

## Búsqueda y fuentes realmente leídas

Búsqueda web en GitHub: https://github.com/search?q=world-heritage-sites&type=repositories

1. Catálogo de Brandon Himpfen, `country`, versión `ce6e2deff0c325b972514b3366d3ee94323c8ee9`: https://github.com/brandonhimpfen/unesco-world-heritage-sites/blob/ce6e2deff0c325b972514b3366d3ee94323c8ee9/country . La sección Venezuela enumera Coro and its Port, Canaima National Park y Ciudad Universitaria de Caracas. Se usaron solo nombres factuales, no descripciones o imágenes.
2. Richard Iannone, UWHS, versión `4b05bf5f2813bcf66a744a9963567bc856c2a33e`, archivo `data/uwhs.rda`: https://github.com/rich-iannone/UWHS/tree/4b05bf5f2813bcf66a744a9963567bc856c2a33e . Datos declarados de la auditoría 2014, no actuales. Se leyó el RDA: ref_no 658/Coro/cultural/1993/ve; 701/Canaima/natural/1994/ve; 986/Ciudad Universitaria/cultural/2000/ve. Licencia MIT y copyright preservados en UWHS-LICENSE.txt. Se utilizaron nombres, categorías y años históricos; no se reutilizaron coordenadas, superficies ni estado de peligro histórico como si fueran actuales.

Las fuentes secundarias comparten probablemente origen UNESCO: el contraste confirma consistencia de identificación, no dos verificaciones de campo independientes. Los textos en español son resúmenes originales limitados a esos hechos.

## Fuentes oficiales pendientes

Intentos directos a https://whc.unesco.org/en/list/701/ , /658/ y /986/ bloqueados por el proxy con HTTP 403/CONNECT. Inparques no se consultó. El borrador de configuración devolvió `draft_not_editable` al proponer permitir whc.unesco.org y www.inparques.gob.ve; no se confirmó actualización de red. Los enlaces UNESCO se ofrecen como referencias oficiales **no consultadas directamente**.

## Lo que se publica y lo que no

`places.json` es el catálogo versionado de la vista pública GitHub Pages. Tres sitios reales, revisión documental parcial, sin fotos, coordenadas, precios, horarios, contactos ni recomendaciones operativas inventadas. La app Next/PostgreSQL conserva su base local de demostración; no se han importado estos registros como fichas operativamente verificadas.

La jerarquía administrativa exacta no se inventa: las fichas se ubican solo en Venezuela hasta documentarla. Los marcadores y rutas no se muestran. El antiguo contenido sintético se sustituye en Pages; los fixtures exclusivos de prueba permanecen fuera de este catálogo.

Regenerar la página desde la raíz con `node scripts/build-pages.mjs`. No editar docs/index.html manualmente. La vista pública usa hashes para rutas compatibles con Pages; la búsqueda y los filtros son locales. El panel editorial pertenece a la app con servidor y se explica como no disponible aquí.
