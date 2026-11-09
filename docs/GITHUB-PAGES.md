# Sitio estático en GitHub Pages

Repositorio: medinacaj/descubriendovenezuela.

El proyecto genera `docs/index.html`, `docs/explorar/index.html`, `docs/lugares/<id>/index.html`, `docs/regiones/<region>/index.html` y `docs/sitemap.xml` desde `content/places.json`. Las fichas se enlazan sin depender exclusivamente de rutas hash; el explorador original permanece como vista ligera.

Configurar GitHub Pages en **Settings → Pages → Build and deployment → Source: GitHub Actions**. El flujo de CI publica el artefacto únicamente después de superar las comprobaciones. La configuración antigua «Deploy from a branch → main → /docs» debe sustituirse para aplicar este bloqueo de publicación.

URL prevista: https://medinacaj.github.io/descubriendovenezuela/

Comandos: `npm ci`, `npm run build:pages`, `npm run test:pages`. Las nuevas pruebas de rutas se ejecutan también con `npm test`. El flujo de GitHub Actions ejecuta pruebas de aplicación, base y generación; para publicar solo deben integrarse cambios validados.

**Limitaciones:** la vista estática muestra hechos documentados, no confirmación de apertura ni disponibilidad. El panel editorial, PostgreSQL, registro de propietarios, pagos y reservas no funcionan en Pages. No activar anuncios hasta contar con contenido y políticas adecuados.

## Publicación condicionada a las pruebas

El flujo `.github/workflows/ci.yml` ahora prepara `work/pages` y publica ese artefacto solo después de validar datos, licencias, regeneración, base de datos, build, accesibilidad y navegadores. El artefacto excluye documentación operativa, credenciales y datos editoriales privados. Los PR validan pero no despliegan; solo `main` o la ejecución manual sobre `main` pueden publicar. Se utilizan runners estándar y Pages en este repositorio público, sin contratar servicios.

Para utilizar este flujo, seleccionar **Settings → Pages → Build and deployment → Source: GitHub Actions**. La aplicación Next sigue necesitando Node/PostgreSQL; el despliegue de Pages no publica el panel ni la base de datos.

Next y Pages comparten los IDs públicos `/lugares/<catalog_id>`. En la aplicación, las URLs UUID antiguas de registros importados redirigen permanentemente a esos IDs. Los UUID de fichas editoriales independientes se conservan; los borradores siguen ocultos. La indexación de Next exige `SITE_PUBLIC_READY=true` y un `APP_ORIGIN` HTTPS válido. Admin y registros DEMO continúan con noindex. El sitemap Next usa los mismos IDs públicos que las tarjetas y metadatos.

Pruebas del flujo completo de la aplicación: con una base local exclusiva preparada, ejecutar `npm run db:migrate`, `npm run catalog:import`, `npm run build` y `npm run test:e2e`. Playwright inicia automáticamente el servidor de producción; no ejecutar las pruebas editoriales en producción. Las pruebas E2E de publicar/retirar requieren el editor DEMO creado por el procedimiento de desarrollo.
