# Activar la vista web en GitHub Pages

En el repositorio medinacaj/descubriendovenezuela:

1. Settings → Pages.
2. Build and deployment → Source: Deploy from a branch.
3. Branch: main; carpeta: /docs; Save.
4. Esperar la publicación que indica GitHub y abrir el enlace mostrado por Pages.

Dirección prevista: https://medinacaj.github.io/descubriendovenezuela/

`docs/index.html` es una vista navegable autónoma y explícitamente etiquetada como demostración. Permite explorar el diseño, buscar y abrir las fichas DEMO. No ejecuta el panel editorial, PostgreSQL o el mapa de la aplicación con servidor. GitHub Pages sirve archivos estáticos; la aplicación Next.js completa necesita un alojamiento que ejecute Node.js y PostgreSQL/PostGIS.

La API de GitHub devolvió Forbidden al intentar comprobar Pages desde esta sesión. No se afirma que Pages esté activado ni publicado hasta verificar la URL real.
