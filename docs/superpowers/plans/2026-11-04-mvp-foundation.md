# Venezuela en el Mapa Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir la primera base funcional pública y administrativa, con persistencia, revisión y auditoría, sin presentar datos inventados como reales.

**Architecture:** Aplicación modular Next.js con API y páginas SSR, PostgreSQL/PostGIS local y mapa MapLibre configurable. Capa de dominio compartida para validar publicación, consultas públicas y administración. Región piloto pendiente; catálogo productivo inicialmente vacío.

**Tech Stack:** TypeScript, Next.js, Tailwind, PostgreSQL/PostGIS, Docker Compose, MapLibre, Vitest y Playwright; versiones estables fijadas al instalar.

**Spec:** `docs/architecture.md`, basada en la especificación maestra del usuario.

## Global Constraints

- No contratar Supabase ni servicios de pago sin autorización.
- No inventar lugares, coordenadas, fotos, horarios, tarifas, reseñas ni métricas.
- No presentar prototipos estáticos como funcionalidades operativas.
- No exponer lugares sensibles ni datos privados.
- Ficha básica gratuita; publicidad desactivada; región piloto pendiente.
- Usar este checkout aislado; no crear worktrees salvo petición del usuario.
- No publicar externamente ni efectuar cambios irreversibles sin autorización.

## Review Focus

- Borradores consultados por ID o slug nunca se filtran al público: probar API, HTML y sitemap en tarea 2.
- Ubicación sensible no se filtra en ninguna serialización pública: probar proyección pública en tarea 1 y páginas en tarea 2.
- Tarifas caducadas o sin fuente se muestran como desconocidas: probar límites de vigencia en tarea 1.
- Escrituras anónimas, CSRF y medios sin autorización se rechazan: probar servidor en tarea 3.
- Reinicio, filtros combinados y fallos de base de datos no se confunden con catálogo vacío: integración y E2E en tareas 2 y 4.

---

### Task 1: Persistencia y reglas editoriales

**Files:** `package.json`, `package-lock.json`, `tsconfig.json`, `compose.yaml`, `.env.example`, `.gitignore`, `db/migrations/001_core.sql`, `scripts/migrate.ts`, `src/lib/db.ts`, `src/domain/places.ts`, `tests/domain/places.test.ts`, `tests/integration/persistence.test.ts`.

**Interfaces:** Produce `publicPlace(record, now)` para una proyección pública sin datos privados; `assertPublishable(record)` rechaza ausencia de fuente/revisión/licencia; repositorio `searchPlaces(filters)`, `getPublicPlace(id)` y `getTerritoryChildren(parentId)` con paginación estable. Definir los tipos en `src/domain/places.ts` y no duplicarlos en UI.

- [ ] Escribir pruebas: `publicationRequiresEvidence`, `sensitiveCoordinatesAreAbsent`, `expiredAndUnsourcedPricesAreUnknown`, `territoryParentsHaveCorrectTypes` y `recordsSurviveReconnect`; datos sintéticos solo en base exclusiva de pruebas.
- [ ] Ejecutar pruebas y comprobar fallo por módulos o esquema ausentes.
- [ ] Instalar dependencias fijadas; implementar esquema, migraciones transaccionales, consultas parametrizadas y reglas del diseño. Publicación y verificación son estados separados.
- [ ] Ejecutar `npm run test:domain` y `npm run test:integration`; comprobar migración aplicada dos veces sin pérdida de datos y PostGIS activo.

### Task 2: Exploración pública

**Files:** `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `src/app/explorar/page.tsx`, `src/app/lugares/[id]/[slug]/page.tsx`, `src/app/territorios/[id]/[slug]/page.tsx`, `src/app/api/places/route.ts`, `src/app/api/places/[id]/route.ts`, `src/app/api/territories/route.ts`, `src/components/explorer.tsx`, `src/components/place-map.tsx`, `src/app/sitemap.ts`, `tests/integration/public-api.test.ts`, `tests/e2e/explorer.spec.ts`.

**Interfaces:** Consume repositorio y proyección de tarea 1. Produce endpoints definidos en diseño y filtros reflejados en URL; mapa consume exclusivamente proyecciones públicas con ubicación autorizada.

- [ ] Escribir pruebas: `draftIs404Everywhere`, `combinedFiltersAndPagination`, `emptyDiffersFromUnavailable`, `sensitiveCoordinatesAbsentFromHtml`, `unknownPriceLabel` y navegación móvil por teclado.
- [ ] Ejecutarlas y comprobar fallos previos a implementación.
- [ ] Implementar portada, explorador, fichas, navegación territorial, SEO y estados reales. Mapa configurable sin requests a proveedor no autorizado; lista utilizable sin mapa. No indexar contenido vacío.
- [ ] Ejecutar integración y E2E; verificar manualmente vista móvil, foco, contraste, atribución y falta de configuración cartográfica. No declarar validación de proveedor real con mocks.

### Task 3: Administración y medios

**Files:** `src/lib/auth.ts`, `src/lib/media.ts`, `scripts/create-admin.ts`, `src/app/admin/`, `src/app/api/admin/`, `src/app/api/media/[id]/route.ts`, `tests/integration/admin.test.ts`, `tests/e2e/admin.spec.ts`.

**Interfaces:** Consume `assertPublishable` y repositorio. Produce sesiones opacas, acciones de revisión/publicación/retirada y auditoría en la misma transacción; medios públicos únicamente tras aprobación.

- [ ] Escribir pruebas: `anonymousWriteDenied`, `invalidOriginDenied`, `expiredSessionDenied`, `loginThrottled`, `unlicensedMediaRejected`, `imageMetadataRemoved` y `publishAndAuditAreAtomic`.
- [ ] Ejecutarlas y verificar fallos antes de escribir implementaciones.
- [ ] Implementar acceso local sin credencial predeterminada, cookies seguras, permisos en servidor y formularios con errores accesibles. Implementar imágenes recodificadas, límites y atribución.
- [ ] Ejecutar integración y recorrido E2E: crear borrador, aportar evidencia, revisar, publicar, consultar públicamente, retirar y comprobar auditoría. Fixtures no se insertan en la base de desarrollo.

### Task 4: Operación y entrega verificable

**Files:** `README.md`, `docs/operations.md`, `docs/editorial-policy.md`, `docs/api.md`, `docs/roadmap.md`, `scripts/backup.sh`, `scripts/restore-test.sh`, `playwright.config.ts`, configuración CI.

**Interfaces:** Usa comandos de instalación, migración, pruebas y arranque de tareas anteriores. Produce instrucciones reproducibles con límites de proveedores y matriz terminado/pendiente/bloqueado.

- [ ] Escribir prueba de restauración en una base aislada; confirmar que falla sin respaldo válido y nunca apunta a la base de desarrollo.
- [ ] Documentar variables sin secretos, arranque, creación del administrador, licencias, verificación, costos, acceso, respaldo y limitaciones. Mantener módulos futuros como pendientes.
- [ ] Ejecutar `npm ci`, `npm run typecheck`, pruebas de dominio/integración/E2E y `npm run build`; registrar resultados reales. Probar reinicio de servicios y restauración.
- [ ] Guardar configuración reutilizable de instalación/arranque del entorno cuando los comandos estén probados. No publicar el entorno ni la web.
- [ ] Revisar diff final, ausencia de secretos/datos simulados en producción, accesibilidad y seguridad; informar limitaciones. La falta de piloto o proveedor no autoriza afirmar que existe inventario real o mapa productivo validado.

## Cobertura y límites revisados

Esta primera entrega cubre la base de la fase 1; el piloto editorial y el proveedor cartográfico son necesarios para la aceptación completa con datos reales. Creadores, aportes ciudadanos, publicidad, rutas calculadas, IA, PWA offline y traducciones permanecen en fases posteriores, con migraciones y planes propios. No se sustituyen por pantallas decorativas.
