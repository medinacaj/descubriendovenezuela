# Catálogo documental compartido — noviembre de 2026

## Inventario real: 234 fichas documentales (25 territorios)

Los 20 lugares incorporados el 6 de noviembre de 2026 están documentados en [RESEARCH-2026-11-06.md](../content/RESEARCH-2026-11-06.md). Las nueve entradas anteriores se conservan. Se añadieron otras ocho fichas para representar Anzoátegui, Barinas, Carabobo, Cojedes, Delta Amacuro, Lara, Portuguesa y Zulia, con [fuentes en el informe ampliado](../content/RESEARCH-COBERTURA-2026-11-06.md). Los sitios reales identificados no equivalen a inventario de establecimientos operativos ni a verificación de visitas. Las 139 fichas añadidas el 6 de noviembre de 2026 amplían parques, cayos, playas, patrimonio, gastronomía, regiones y negocios identificados en sitios propios. Se incorpora Dependencias Federales y el inventario ahora cubre 25 territorios. Los nueve hospedajes cuentan con referencias directas a sus operadores, sin comprobación independiente de disponibilidad o permisos de imagen. La importación y la vista estática usan el mismo `content/places.json`.

## Fuente única y responsabilidades

`content/places.json` es el catálogo de lugares documentados que también alimenta GitHub Pages. Las fichas sintéticas de la aplicación nunca se fusionan con ese archivo. Cada registro debe cumplir `content/schema.mjs` y mantener su fuente, fecha, alcance documental y atribución de imágenes.

El comando `npm run catalog:import`, tras `npm run db:migrate`, replica estas fichas en PostgreSQL. La migración `002_catalog_bridge.sql` agrega el identificador estable `catalog_id`, el alcance `verification_note` y los créditos `media_credits`. Se puede ejecutar varias veces sin crear duplicados ni borrar fichas editoriales independientes.

El catálogo versionado se edita solo en `content/places.json`: el panel impide modificar fichas con `catalog_id`, evitando divergencia silenciosa. Los demás registros editoriales siguen administrándose desde el panel.

Las fichas documentales quedan publicadas con el alcance de la verificación claramente visible. **No representan verificación presencial ni disponibilidad actual.** Las coordenadas exactas se mantienen protegidas. Se sirven seis mapas aprobados y cincuenta y dos fotografías reales de la lista de permitidos `content/licensed-photographs.json`. Cada fotografía identifica autor, licencia Creative Commons, página de origen y conversión técnica a WebP. La fotografía no prueba condiciones de visita actuales.

## Ejecutar y verificar

```sh
npm ci
npm run db:migrate
npm run catalog:import
npm run catalog:import
npm test
npm run typecheck
npm run build
npm run build:pages
npm run test:pages
```

Se necesita PostgreSQL/PostGIS y Chromium para las pruebas de navegador. No ejecutar los tests de integración contra una base con datos de producción; usan la base exclusiva `venezuela_test`.

En Docker, `deploy/compose.yaml` ejecuta migración e importación antes del servidor. El comando de importación no solicita servicios externos, reservas ni pagos.

## SEO y puesta en producción

La app continúa bloqueando la indexación por defecto. Para activar sitemap y robots de contenido real, primero verificar un alojamiento público con HTTPS, base de datos persistente, políticas, revisión legal, respaldos externos y contenido suficiente; solo entonces definir `SITE_PUBLIC_READY=true` y un `APP_ORIGIN=https://...` confirmado.

GitHub Pages es una publicación estática independiente; no contiene la administración ni PostgreSQL. No se deben confundir las dos direcciones ni afirmar que el backend está operativo por el hecho de haber publicado Pages.

## Fuera de esta entrega

Siguen pendientes verificación de campo, autorizaciones y fotografías de establecimientos, contactos y horarios, registro público de negocios, moderación multiusuario, rutas, creadores, publicidad, soporte, despliegue financiado y auditorías completas de seguridad y accesibilidad. Ninguno se presenta como disponible.

## Importación de fotografías con licencia

El manifiesto [licensed-photographs.json](../content/licensed-photographs.json) enumera únicamente imágenes de destinos identificados en sus páginas originales de Wikimedia Commons y sus autores/licencias. Ejecutar `node scripts/import-licensed-photos.mjs --only-missing` desde una máquina con Internet antes de `npm run build:pages`. El script descarga solo los archivos permitidos, valida formato y dimensiones, convierte a WebP y antepone la imagen a los mapas existentes sin eliminar las cartografías. Los binarios se versionan localmente; la web no depende de hotlinks. La atribución de imágenes debe conservarse en todas las visualizaciones y variantes.

## Presentación visual (noviembre de 2026)

Todas las fichas y tarjetas muestran un recurso visual. **57 destinos poseen fotografía o mapa propio**; los otros **177 usan temporalmente una fotografía acreditada de otra ubicación**, identificada como referencia y no como imagen del destino. Se han descargado y versionado treinta y dos fotografías adicionales de Wikimedia Commons con autorización Creative Commons individual. El explorador público ofrece vistas **Tarjetas, Lista y Fichas**, conserva el modo en la URL, y mantiene filtros por categoría, territorio y texto. La meta editorial es sustituir cada referencia por una fotografía específica, verificada y autorizada.

## Ampliación y UX verificables

Además de la expansión inicial de 139 lugares, se incorporaron **58 atractivos de investigación independiente** publicados en [`content/INVESTIGACION-INDEPENDIENTE-2026-11-06.md`](../content/INVESTIGACION-INDEPENDIENTE-2026-11-06.md). El catálogo actual tiene **234 fichas**, 52 fotografías reales y seis mapas, con **57 medios propios y 177 imágenes referenciales explícitas**. El explorador muestra inicialmente 30 tarjetas, permite cargar más lotes, tiene tres vistas visuales y comparte `docs/base.css`. La carpeta del proyecto no controla `robots.txt` de la raíz del dominio GitHub Pages. Los requisitos completos de WCAG 2.2 AA, Core Web Vitals y seguridad productiva requieren pruebas adicionales.
