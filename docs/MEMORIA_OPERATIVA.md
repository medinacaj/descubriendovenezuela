# Memoria operativa — Venezuela en el Mapa

Fecha: **26/11/2026**, referencia de usuario America/Santiago. Leer junto a DECISIONES.md; verificar otra vez el remoto al iniciar una sesión.

## Identidad inequívoca y referencias

- Propietario: AJ-Med!n@, GitHub **medinacaj**.
- Repositorio público oficial: https://github.com/medinacaj/descubriendo-vzla; **ID 1445188413**. GitHub resuelve el nombre histórico medinacaj/descubriendovenezuela al mismo repositorio renombrado.
- Principal real: **main**, código de referencia **f41c6ac52331447a773c4e4586763e414bf087db** (15/11/2026). Árbol 2d82bd698b216799f3c42576f994058b58da20d3.
- Continuidad: **docs/readme-continuidad-20261121**, [PR #40](https://github.com/medinacaj/descubriendo-vzla/pull/40), abierto; base documental anterior 597e2898648cc4f5ddfd2e4cc6b7189a6049d648, hijo directo de main. Este respaldo amplía su README sin descartar su contenido.
- Paquete: venezuela-en-el-mapa **0.1.0**. Releases de GitHub: lista vacía al consultar; tags no verificados por limitación del conector. No se afirma una nueva versión comercial.
- Propósito: guía documental de destinos venezolanos con fuentes y licencias, catálogo estático y aplicación editorial. Sin reservas, cobros, anuncios activos ni garantía de disponibilidad.

## Implementado e integrado

Catálogo de **314 fichas y 25 territorios**, 113 con fotografía propia, 5 con mapa y 196 sin imagen propia (cifras documentadas por README vigente). Seis noticias/agendas revisadas el 09/11 y 12 perfiles de creadores; archivo editorial previo conservado. Favoritos, plan por jornadas y comprobaciones del visitante guardados localmente en el navegador.

Pages y Next comparten catalog_id, rutas públicas, fuentes y datos versionados. Importación idempotente desde content/places.json preserva fichas independientes; UUID importados redirigen al ID público. SEO/canonical/sitemap y controles noindex; DEMO y admin no indexables, borradores ocultos y coordenadas sensibles protegidas. Panel editorial con sesiones/auditoría y publicación/retirada. Los créditos y licencias no deben perderse.

- [PR #34](https://github.com/medinacaj/descubriendo-vzla/pull/34): catálogo/SEO, tarjetas, noticias y CI.
- [PR #35](https://github.com/medinacaj/descubriendo-vzla/pull/35): alturas uniformes entre todas las filas, sin recortar información.
- [PR #37](https://github.com/medinacaj/descubriendo-vzla/pull/37): fechas reales de calendario en fichas/tarifas, integrado 15/11.
- [PR #38](https://github.com/medinacaj/descubriendo-vzla/pull/38): límites streaming antes de formData (4 KiB login, 24 KiB fichas), integrado 15/11.
- [PR #39](https://github.com/medinacaj/descubriendo-vzla/pull/39): pruebas de indexación fail-closed admin/API, integrado 15/11.

## Arquitectura, tecnologías e infraestructura

Next.js App Router 16, React 19, TypeScript 7, pg 8, Zod 4, MapLibre 6 y sharp; versiones exactas en package-lock.json. Node.js 24; PostgreSQL 17/PostGIS 3.5 con Compose para entorno local/CI. Vitest, Playwright y axe. Generador scripts/build-pages.mjs más scripts/build-directories.mjs; datos content/, aplicación src/, esquema db/migrations/, controles scripts/ y tests/.

GitHub Actions valida con PostGIS desechable, importación doble, generación sin deriva, tipos, tests, build, Chromium/Firefox/WebKit, axe y E2E Next. scripts/stage-pages.mjs construye work/pages con recursos públicos; no copia documentación operativa. La publicación personalizada depende de validar y de main; un PR no despliega mediante este flujo. Vigencia editorial semanal independiente.

**Dominios/entornos:** las URLs generadas siguen apuntando a https://medinacaj.github.io/descubriendovenezuela/ y base /descubriendovenezuela/. GitHub renombró el repositorio; el log del job deploy 139973393990 (run 45838395200, 26/11) informa como environment URL https://medinacaj.github.io/descubriendo-vzla/. Esto confirma el destino declarado por GitHub, no su respuesta HTTP ni redirecciones. Existe discrepancia entre ese destino y las rutas antiguas generadas; la configuración administrativa Pages no está verificada. No asumir que basta cambiar el remoto ni reemplazar globalmente URLs históricas. No se verificó dominio propio, staging público ni hosting público Next/PostGIS. El entorno Cloud de desarrollo no equivale a staging o producción.

Variables (solo nombres): DATABASE_URL, POSTGRES_PASSWORD, APP_ORIGIN, NEXT_PUBLIC_MAP_STYLE, SITE_PUBLIC_READY; para Compose de despliegue DEPLOY_DATABASE_URL y DEMO_PORT. Ejemplos en .env.example y deploy/environment.example. No publicar valores privados ni .data.

## Evidencia remota comprobada en este respaldo

Consultas directas de GitHub: identidad/ID, principal/SHA, árbol, ramas, PR recientes, PR #40 archivos y revisiones (sin revisiones registradas al consultar), issue #36, workflows y jobs.

| Evidencia | Resultado comprobado |
|---|---|
| CI integral main, SHA f41c6ac…, run [43718879698](https://github.com/medinacaj/descubriendo-vzla/actions/runs/43718879698) | completed / success histórico, consultado ahora |
| CI rama documental #40, SHA 597e289…, run [44934724767](https://github.com/medinacaj/descubriendo-vzla/actions/runs/44934724767) | completed / success histórico; no corresponde aún al nuevo respaldo |
| Pages, SHA f41c6ac…, run [45838395200](https://github.com/medinacaj/descubriendo-vzla/actions/runs/45838395200) | completed / success; acredita ejecución GitHub, no navegación real del sitio |
| Vigencia editorial, SHA f41c6ac…, run [45283600006](https://github.com/medinacaj/descubriendo-vzla/actions/runs/45283600006) | failure; falla el paso Validar noticias, créditos y antigüedad de revisión (23/11) |
| Rama principal | protected: false en endpoint de rama; rulesets alternativos no verificados |

El contenido mantiene reviewedOn 2026-11-09: al 26/11 transcurrieron 17 días; Filven terminó el 23/11 y DiverFest el 21/11 según las agendas documentadas. **No se han vuelto a consultar sus fuentes ni renovado las noticias en este respaldo.**

### Validación nueva ejecutada por la CI del respaldo

[Run 45851296875](https://github.com/medinacaj/descubriendo-vzla/actions/runs/45851296875), commit documental intermedio 23183d189932f786f21ff8c39523d8f04d519be3: **completed / success**, logs consultados directamente. npm ci; editorial:check; build:pages (314 fichas, 366 archivos); git diff --exit-code -- docs/; typecheck; npm test (**59 pruebas, 11 archivos**); importación doble idempotente; build; test:pages en Chromium/Firefox/WebKit; auditoría axe; test:e2e (**8 pruebas**); staging del artefacto y subida completados. Job publicar omitido por ser PR: no se desplegó.

editorial:check advierte 17 días y agendas vencidas filven-caracas-2026 y diverfest-2026-agenda; ese comando comprueba estructura pero no falla por frescura sin --freshness. El fallo de frescura histórico sigue sin resolver. Los tests pasaron sobre bases desechables de CI; no acreditan datos reales ni producción. La actualización documental posterior a4bb4fa9d0a15db856e262221f5aaa67241f246f también obtuvo **CI 45852195494 completed/success**, con los mismos 59 tests, 8 E2E y axe sin hallazgos en 8 vistas; job publicar skipped. El último añadido de este documento registra exclusivamente el fallo de arranque y esas evidencias previas: consultar la CI de su SHA final en PR #40, sin inferirla por las anteriores.

No hay script lint independiente. Comandos aplicables: npm ci; npm run editorial:check; npm run editorial:check -- --freshness; npm run build:pages; npm run typecheck; npm test; npm run build; npm run test:pages; npm run test:e2e. tests/setup.ts utiliza venezuela_test, por lo que hay que comprobar host/aislamiento antes de ejecutar cualquier suite con truncados.

## Estado local y alcance del respaldo

El entorno seleccionado /workspace **falló al arrancar** después de la espera: configuración de capacidades no consultable y wait_for_environment informa exec-server connection attempt failed / environment unavailable / timed out recovering environment readiness from ERS. Antes, exec_command devolvió “No usable execution environment is available”. Está pendiente inspeccionar checkout, cambios sin seguimiento, eliminaciones, commits locales y secretos del disco, y ejecutar de nuevo las pruebas. No se afirma que esté limpio ni que todo avance local esté publicado. El respaldo remoto se puede realizar mediante el conector GitHub, conservando el código remoto existente y sin depender del shell.

El historial accesible recoge ramas locales work (2e6452d, prototipo antiguo), codex/catalog-seo-automation (3207345), codex/refine-all-cards (4e7c8e2) y codex/uniform-card-heights (23163a3). Son referencias históricas **no reinspeccionadas**; los avances equivalentes de catálogo/tarjetas/noticias ya llegaron a main mediante PR #34/#35. No aplicar el prototipo antiguo sobre main. Preservar cualquier avance único en rama propia tras revisar diff y secretos.

Ramas remotas comprobadas: codex/catalog-seo-automation-2026-11-09 (d728f9a…), codex/uniform-card-heights-2026-11-10 (a015bc3…), codex/strict-editorial-price-dates-20261114 (9c7a7af…), codex/limit-admin-form-uploads-20261115 (c215b52…), codex/robots-admin-policy-audit-20261115 (670cbee…), continuidad #40 y ramas históricas feat/feature/fix conservadas. No se borraron ramas.

[PR #22](https://github.com/medinacaj/descubriendo-vzla/pull/22) sigue abierto sobre una base antigua: etiquetas pequeñas y hash CSS editorial. No fusionarlo sin comparar con main; algunas intenciones pueden estar ya incorporadas y el diff incluye contenido estático histórico.

## Pendientes priorizados

- **P0:** ninguno confirmado por esta revisión; no equivale a auditoría completa ni ausencia de vulnerabilidades.
- **P1:** resolver coherencia de URL/base/canonical/sitemap/SW tras rename, contrastando Pages real antes de cambiar scripts/build-directories.mjs, scripts/build-pages.mjs, templates, docs generados y tests/robots-admin-policy.test.ts. Requiere verificación del destino y autorización separada para desplegar.
- **P1:** revisar/archivar agendas vencidas y renovar noticias con fuentes actuales en content/editorial-highlights.json y editorial-news-archive.json; ejecutar control de frescura sin alterar fechas artificialmente.
- **P1:** terminar inventario y respaldo de avances locales cuando el entorno esté disponible; pruebas frescas en contexto seguro. Integrar #40 solo tras revisión/autorización de efectos de main.
- **P1:** continuar [auditoría #36](https://github.com/medinacaj/descubriendo-vzla/issues/36): fuentes/licencias, integridad IDs/borradores, controles admin del entorno real y reglas de protección. Matriz de evidencia requerida por el issue; no cerrarlo por CI verde.
- **P2:** 196 fotografías auténticas/licenciadas faltantes; QA manual móvil/teclado/lector, condiciones/contactos/precios con evidencia; decidir destino de #22 sin regresión.
- **P2:** restauración externa verificable y operación segura antes de publicar backend; configuración HTTPS, respaldo, privacidad, monitoreo y límites reales.
- **P3:** métricas de campo CWV, mejoras futuras de rendimiento/expansión. Propuestas de monetización/IA/traducción no activadas; necesitan decisión propia.

## Siguiente acción concreta

1. Reabrir esta rama y contrastarla con main/PR #40/SHA vigente. Si el entorno está disponible, leer esta memoria y decisiones antes de inventariar Git; guardar avances únicos sin reset ni fuerza.
2. Reconciliar primero el destino Pages y las rutas heredadas por lectura/HTTP, sin desplegar; registrar URL comprobada. Después preparar corrección de rutas y actualización editorial con sus pruebas.
3. Mantener separados respaldo remoto, validación del nuevo SHA, fusión autorizada y comprobación de staging/producción. El SHA final publicado se entrega tras verificar GitHub; este archivo registra su SHA base, nunca el de su propio commit.
