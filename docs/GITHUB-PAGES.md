# Sitio estático en GitHub Pages

Repositorio: medinacaj/descubriendovenezuela.

El proyecto genera `docs/index.html`, `docs/explorar/index.html`, `docs/lugares/<id>/index.html`, `docs/regiones/<region>/index.html` y `docs/sitemap.xml` desde `content/places.json`. Las fichas se enlazan sin depender exclusivamente de rutas hash; el explorador original permanece como vista ligera.

Configurar GitHub Pages en Settings → Pages → Deploy from a branch → main → /docs. Cada cambio en main ejecutará la publicación de Pages. Verificar la última ejecución de «pages build and deployment» y abrir la URL indicada por GitHub.

URL prevista: https://medinacaj.github.io/descubriendovenezuela/

Comandos: `npm ci`, `npm run build:pages`, `npm run test:pages`. Las nuevas pruebas de rutas se ejecutan también con `npm test`. El flujo de GitHub Actions ejecuta pruebas de aplicación, base y generación; para publicar solo deben integrarse cambios validados.

**Limitaciones:** la vista estática muestra hechos documentados, no confirmación de apertura ni disponibilidad. El panel editorial, PostgreSQL, registro de propietarios, pagos y reservas no funcionan en Pages. No activar anuncios hasta contar con contenido y políticas adecuados.
