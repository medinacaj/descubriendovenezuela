# Venezuela en el Mapa

Guía documental de Venezuela con **314 fichas en 25 territorios**, fuentes visibles y fotografías con licencia. El catálogo estático de GitHub Pages y la aplicación Next.js/PostgreSQL comparten IDs públicos y datos versionados. No hay pagos ni reservas ni se acredita operación actual de negocios.

## Estado actual · 9 de noviembre de 2026

- **113 fichas con fotografía del lugar, 5 con mapa y 196 sin imagen propia.** Las fichas pendientes muestran una ausencia explícita; no usan imágenes de otros destinos como fotografías del sitio.
- **6 noticias y agendas** con fuentes consultadas, fecha de publicación, revisión y alcance de evidencia. Las fotos de noticias son ilustrativas y no documentan los eventos. Las noticias anteriores se conservan en `content/editorial-news-archive.json`.
- **12 perfiles de creadores**, selección independiente sin afiliación ni respaldo implícitos; las imágenes son de destinos, no retratos de esas personas.
- Tarjetas, lista y fichas; búsqueda, filtros, favoritos y plan personal guardados solo en este navegador. Las comprobaciones del plan son del visitante, no de la plataforma.
- URLs permanentes, metadatos sociales, sitemap, fuentes y créditos; Next redirige UUID importados a los IDs públicos. Borradores ocultos; DEMO y admin con noindex.
- Paleta viva conservada. Tarjetas revisadas en móvil/escritorio y créditos visibles.

La procedencia se conserva en [content/RESEARCH.md](content/RESEARCH.md), [créditos fotográficos](content/PHOTO-CREDITS.md) y [registro de revisión editorial](content/EDITORIAL-RESEARCH-2026-11-09.md). El [README anterior](docs/history/README-before-2026-11-09.md) queda archivado para conservar las etapas históricas sin mezclar sus cifras con el estado actual.

## Generar y verificar

Node.js 24 y npm:

```sh
npm ci
npm run editorial:check
npm run build:pages
npm run test:pages
npm run typecheck
npm run build
```

`npm test` incluye integración y requiere una base exclusiva `venezuela_test`; preparar con `npx tsx scripts/prepare-tests.ts` según la guía de desarrollo. Nunca ejecutar E2E editoriales sobre producción. El control editorial semanal detecta selecciones sin revisión durante más de 14 días; no modifica fechas ni publica contenido sin evidencia.

## Aplicación editorial local

```sh
bash scripts/setup-demo.sh
npm run catalog:import
npm run build
npm run test:e2e
```

Playwright inicia su servidor para E2E. Para explorar manualmente, ejecutar `npm run start` en otra terminal.

El procedimiento crea credenciales aleatorias en `.data/ACCESO.md`, ignorado por Git. No compartir `.env` ni `.data`. La importación del catálogo es idempotente y no borra fichas independientes. La importación DEMO solo se permite sobre una base local sin fichas reales. Para un entorno existente: seguir [deploy/README.md](deploy/README.md), migrar e importar el catálogo sin usar la importación DEMO.

## Publicación gratuita

La CI valida generación, licencias, datos, integración, navegadores y accesibilidad; prepara un artefacto solo público y publica Pages desde `main` cuando las comprobaciones pasan. Los PR no despliegan. En Settings → Pages seleccionar **GitHub Actions** como fuente. [Configuración y operación](docs/GITHUB-PAGES.md).

Next requiere Node y PostgreSQL/PostGIS; GitHub Pages publica el catálogo estático y no ejecuta el panel. `SITE_PUBLIC_READY=true` y un origen HTTPS válido habilitan la indexación de Next después de revisar su operación. No se han contratado servicios.

## Evidencia que requiere trabajo externo

Las 196 fotografías que faltan requieren imágenes auténticas y licencia compatible. Los contactos, precios, accesos y condiciones de visita requieren fuentes actuales y autorización cuando corresponda. Las métricas de campo y la certificación formal WCAG requieren tráfico real y evaluación especializada; las pruebas automáticas son controles técnicos, no certificaciones. Estos límites se muestran públicamente y no se sustituyen por datos inventados.

## Referencias de operación

- [API](docs/api.md), [política editorial](docs/editorial-policy.md) y [privacidad de la demo](docs/demo-status.md).
- [Arquitectura](docs/architecture.md), [respaldos y operación](docs/operations.md), [procedencia cartográfica](public/maps/README.md).
- [Estado consolidado y pendientes con evidencia](docs/ESTADO-2026-11-09.md).
