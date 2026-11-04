# Operación local, respaldo y costos

## Servicios

Ejecutar desde `/workspace/descubriendovenezuela`. `scripts/setup-demo.sh` conserva `.env`, instala con lockfile, espera PostgreSQL/PostGIS, aplica esquema idempotente y prepara cuatro ejemplos y un editor de demo. `npm run build` y `npm run start` inician la versión compilada. En desarrollo usar `npm run dev`. No crear worktrees: este entorno ya está aislado.

PostgreSQL escucha solo en loopback; volumen `postgres_data` de Compose conserva los datos entre reinicios. No usar `docker compose down -v` salvo autorización para borrar datos. Parar únicamente servicios propios con `docker compose stop`. Sesiones y auditoría persisten en PostgreSQL. El proceso Next no sobrevive a una restauración del entorno: reiniciarlo.

`APP_ORIGIN` debe coincidir exactamente con el origen autorizado para escrituras; usar HTTPS al exponer cualquier servidor. `DATABASE_URL` y POSTGRES_PASSWORD no deben imprimirse, versionarse ni ponerse en enlaces. El acceso de demo está en `.data/ACCESO.md`; proteger y rotar antes de cualquier uso compartido.

## Respaldos

Ejecutar `bash scripts/backup.sh`, después `bash scripts/restore-test.sh .data/<archivo>.dump`. La restauración crea una base temporal nueva y solo la elimina si logró crearla; nunca sobreescribe la base original. Comprobar conteo y PostGIS en la salida. Los respaldos contienen cuentas y auditoría: no subirlos al repositorio. Un respaldo en el mismo disco no protege ante pérdida del entorno: antes de producción definir almacenamiento externo cifrado, retención, RPO/RTO y simulacros.

No hay archivos de medios de usuarios en esta versión. Respaldar también configuración y medios cuando ese módulo exista, con secretos separados y acceso mínimo.

## Costos y despliegue

No se contrató ningún servicio. La demo usa recursos del entorno disponible, disco y CPU locales; no implica hosting gratuito permanente. El mapa se sirve localmente sin proveedor de mosaicos ni facturación por solicitudes. Para producción evaluar cómputo Node, PostgreSQL/PostGIS persistente, disco, respaldos, egreso, dominio, correo y moderación; registrar cuotas reales del proveedor elegido. No hay estimaciones de ingresos ni publicidad activa.

No se publicó sitio ni snapshot de entorno. El catálogo real, validación legal, HTTPS público y operación de imágenes siguen pendientes. No ofrecer reservas, rutas o disponibilidad.

## Comprobaciones previas a publicación

- Datos reales con evidencia, autorización y revisión humana; revisión territorial de fuentes.
- Seguridad de sesiones, límites distribuidos, cabeceras/CSP y tamaño de solicitudes detrás de proxy confiable.
- WCAG: teclado, foco, contraste, formularios y lector de pantalla; auditar contra contenido real.
- SEO: URLs canónicas, sitemap y schema de fichas reales; la demo está marcada noindex.
- Recuperación externa probada y monitoreo; política de privacidad con responsable y canal de contacto.
