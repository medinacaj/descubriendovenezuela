# Venezuela en el Mapa

Demo local funcional de exploración turística y administración editorial. **No es un inventario real de establecimientos ni está publicada.** Los cuatro ejemplos están marcados DEMO y no tienen coordenadas, precios, fotografías ni reseñas inventadas. El paisaje y las tarjetas son ilustraciones abstractas.

## Catálogo público inicial

La vista de GitHub Pages contiene tres sitios reales: Parque Nacional Canaima, Coro y su Puerto y Ciudad Universitaria de Caracas. Son fichas de identificación documental, con dos catálogos secundarios consultados y referencias oficiales aún pendientes de consulta directa; no se confirman condiciones actuales de visita. Los datos están en [content/places.json](content/places.json) y su procedencia en [content/RESEARCH.md](content/RESEARCH.md).

Regenerar Pages con `npm run build:pages`. La aplicación Next/PostgreSQL mantiene aparte sus datos de demostración: no se han confundido con este catálogo real. Las capturas de portada y móvil muestran el catálogo actual con la paleta de colores vivos.

## Vista de la demo

Paleta viva inspirada en la guacamaya: azul intenso, amarillo brillante, rojo y verde tropical.

![Portada de Venezuela en el Mapa con la paleta guacamaya](docs/screenshots/portada.png)

[Ver captura móvil](docs/screenshots/movil.png) · [Estado y límites de la demo](docs/demo-status.md)

## Inicio rápido

Requisitos: Node.js 24, npm y Docker con Compose. Desde este checkout:

```sh
bash scripts/setup-demo.sh
npm run build
npm run start
```

El servidor escucha en el puerto 3000. La portada, `/explorar`, `/lugares/[id]`, `/admin`, `/politica-editorial` y `/privacidad` funcionan. Las credenciales aleatorias del editor local se guardan en `.data/ACCESO.md`, ignorado por Git. No hay contraseña predeterminada. No compartir ese archivo ni `.env`.

La configuración existente se conserva. La importación demo es explícita, repetible y se niega a ejecutarse si existen fichas reales. No usarla en producción. Para otro entorno, usar `.env.example`, migración y `admin:create` sin importación demo. En `admin:create`, proporcionar `ADMIN_EMAIL` y `ADMIN_PASSWORD` de al menos 12 caracteres mediante un mecanismo seguro de variables de proceso; no escribir contraseñas en comandos guardados.

## Despliegue con base de datos

[Guía Docker de despliegue](deploy/README.md): imagen sin credenciales locales, PostgreSQL/PostGIS persistente, migración y comprobación de salud. Aún requiere elegir y conectar un alojamiento para obtener una URL pública.

## Desarrollo y pruebas

```sh
npm run dev
# En otra terminal, preparar base de pruebas exclusiva:
npx tsx scripts/prepare-tests.ts
npm test
npm run typecheck
npm run build
# Servidor activo en puerto 3000; requiere /usr/bin/chromium:
npm run test:e2e
```

Las pruebas de integración borran **únicamente** `venezuela_test`. Las pruebas de navegador crean fichas sintéticas temporales y luego las retiran; sus registros de auditoría se conservan. Utilizan el acceso local de `.data/demo-access.json`. No ejecutar E2E en producción.

## Qué incluye

- Búsqueda textual, categoría y jerarquía territorial con paginación; filtros compartibles en URL.
- Mapa MapLibre interactivo con cartografía local de dominio público Natural Earth; sin costos ni solicitudes de mosaicos externos. Límites generalizados y no oficiales; no usar para navegación ni delimitación territorial. Sin marcadores hasta contar con ubicaciones autorizadas.
- Fichas públicas; borradores ocultos; precio desconocido explícito; coordenadas sensibles ocultas.
- Login editorial, sesiones en PostgreSQL, crear/editar/publicar/retirar y auditoría transaccional.
- Fuente HTTPS, fecha y estado verificado obligatorios para publicar. Etiqueta de demo independiente.
- Estado vacío distinto de fallo del catálogo; diseño responsive y navegación por teclado.

## Límites deliberados de esta demo

Aún no hay catálogo administrativo oficial, región piloto, fichas reales autorizadas, carga de imágenes, precios editables, roles múltiples, aportes ciudadanos, creadores, anuncios, rutas, IA, favoritos ni PWA offline. La prueba del flujo con datos sintéticos no acredita verificación de campo. Las políticas públicas describen solo esta demo. No publicar este servidor como producto terminado.

El limitador de login es por cuenta para la demo local; para acceso público se requiere identidad de cliente desde proxy confiable y límites distribuidos. Antes de producción: revisión de seguridad, responsable legal y canal de derechos, operación de imágenes con licencia, recuperación externa, HTTPS, secretos por entorno y catálogo real. No hay pagos ni reservas.

## Documentación

- [Arquitectura](docs/architecture.md) y [plan](docs/superpowers/plans/2026-11-04-mvp-foundation.md)
- [Operación, respaldos y costos](docs/operations.md)
- [API](docs/api.md), [política editorial](docs/editorial-policy.md) y [estado de ejecución](docs/progress.md)
- [Procedencia cartográfica](public/maps/README.md)
