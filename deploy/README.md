# Despliegue de la demo con Docker

Este procedimiento conserva Next.js y PostgreSQL/PostGIS. No convierte el proyecto en una web estática ni publica automáticamente ningún servidor. Requiere un servidor Linux con Docker/Compose, almacenamiento persistente y un proxy HTTPS. No se contrató alojamiento ni se configuró un dominio público.

## Preparar configuración privada

Desde la raíz del repositorio, copiar `deploy/environment.example` a `.data/deploy.env` (crear `.data` primero). Generar una contraseña aleatoria larga, preferiblemente hexadecimal para evitar escape de URL; usar la misma en POSTGRES_PASSWORD y DEPLOY_DATABASE_URL, con host **db**, no localhost. Establecer APP_ORIGIN con el origen HTTPS exacto (sin barra final) y DEMO_PORT con un puerto local disponible. No reutilizar las credenciales de la demo de desarrollo ni subir este archivo a Git.

## Construir y arrancar

```sh
docker build -t venezuela-demo:local .
docker compose --env-file .data/deploy.env -f deploy/compose.yaml up -d --wait
```

En el entorno administrado que usa CA de proxy, construir preservando TLS:

```sh
docker build --secret id=proxy_ca,src="$CODEX_PROXY_CERT" -t venezuela-demo:local .
```

La imagen no copia `.env`, `.data`, contraseñas locales ni respaldos. Corre como usuario `node`. Incluye herramientas de migración y bootstrap de esta demo; la imagen no se presenta como mínima de producción.

Compose crea un volumen independiente, espera PostgreSQL, aplica migración y arranca la aplicación. La base no publica ningún puerto. La web escucha por defecto en **127.0.0.1:3100** del servidor para situar un proxy HTTPS delante; no usar ese puerto como enlace público. APP_ORIGIN debe coincidir con el dominio público autorizado, porque las escrituras rechazan otro Origin. Un proxy inverso puede reenviar al puerto local sin alterar Origin.

## Cargar ejemplos, explícitamente

Solo en una base de demostración:

```sh
docker compose --env-file .data/deploy.env -f deploy/compose.yaml run --rm -e ALLOW_DEMO_IMPORT=yes migrate npx tsx scripts/demo.ts
```

Los cuatro registros no tienen coordenadas/fotos ficticias y están etiquetados DEMO. La importación es repetible y se rechaza si existen registros reales. El contenedor no crea administradores por defecto. Para crearlos, usar `npm run admin:create` en un contenedor one-shot pasando ADMIN_EMAIL/ADMIN_PASSWORD desde el entorno de un gestor seguro; no guardar ni imprimir esos valores ni usar el acceso local de desarrollo en un servidor público.

## Validar antes de publicar

- GET `/api/health` debe devolver 200 y `{"status":"ready"}`; comprueba esquema y conexión. No devuelve datos ni versiones. Con base caída devuelve 503 y no debe quedar cacheado.
- GET `/api/places` debe devolver solo fichas publicadas y sus etiquetas DEMO.
- Abrir portada, mapa local y ficha; comprobar en móvil y escritorio.
- Verificar HTTPS y APP_ORIGIN antes de habilitar acceso editorial. No hay usuario/contraseña por defecto en la imagen.
- Reiniciar servicios y confirmar que los registros siguen presentes.

Los scripts locales `backup.sh` y `restore-test.sh` usan el Compose de desarrollo. Para este despliegue usar **el Compose y env-file de deploy** con pg_dump/pg_restore y comprobar la restauración en una base temporal; no restaurar sobre la base activa. Guardar copias cifradas fuera del servidor y acordar retención antes de uso real.

## Actualizar sin borrar datos

Obtener cambios, reconstruir imagen y ejecutar el mismo `up -d --wait`. El migrador corre antes de la web. Hacer respaldo primero. No ejecutar `down -v`: elimina el volumen. Para detener sin borrar: `docker compose --env-file .data/deploy.env -f deploy/compose.yaml stop`.

## Qué falta para un enlace público

Elegir cuenta/servidor, revisar costo y cuotas, conectar acceso mediante el mecanismo seguro del proveedor, configurar dominio y TLS y probar la URL real. GitHub almacena el código; GitHub Pages no ejecuta Next.js con esta base de datos/panel. Vercel u otro servicio Node necesitaría además PostgreSQL con PostGIS y sus credenciales. No se garantiza hosting gratuito permanente ni se contrata una base de pago.
