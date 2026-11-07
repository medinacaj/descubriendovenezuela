# Controles de seguridad y rendimiento aplicados · noviembre 2026

## Implementado

- JavaScript propio servido desde archivos separados en vez de `<script>` ejecutable inline; JSON-LD sigue como datos.
- CSP a través de **meta HTML** con `script-src 'self'`, `style-src 'self'`, bloqueo de objetos y restricciones de recursos. Se debe verificar en navegadores reales.
- Fotografías locales autorizadas: derivados WebP de 480/800 px generados a partir de cada original versionado. `srcset` y `sizes` ajustan descarga según pantalla.
- Caché de recursos JS usados para navegación sin conexión.
- Pruebas de que CSP y recursos externos se generan correctamente.

## Límites importantes

GitHub Pages (sitio del proyecto en un subdirectorio) **no permite configurar desde este repositorio cabeceras HTTP generales** como `frame-ancestors`, `X-Content-Type-Options` o `Permissions-Policy`. La CSP por meta no sustituye a los encabezados HTTP ni permite la directiva `frame-ancestors`; se requiere un hosting/proxy configurable si se quieren esos controles.

El archivo `/descubriendovenezuela/robots.txt` no equivale al `/robots.txt` de la raíz del dominio compartido `medinacaj.github.io`; indexación depende de metadatos y sitemap, más eventual control de la raíz o dominio propio.

Las variantes WebP no prueban LCP/INP/CLS de usuarios reales; faltan mediciones de campo y auditoría WCAG 2.2 AA formal. El backend Next.js no está expuesto por la web estática de GitHub Pages; su revisión de autenticación y permisos debe ser independiente si se publica.

## Compatibilidad WebKit y CSP

Se retiró únicamente la directiva `upgrade-insecure-requests` de la política **meta**. En el servidor HTTP local de pruebas, WebKit transformaba todas las hojas CSS en peticiones HTTPS inexistentes y presentaba página sin estilos; la evidencia figura en logs de GitHub Actions. La web pública se aloja exclusivamente en HTTPS y sus activos se sirven mediante rutas relativas. Permanecen `script-src 'self'`, `style-src 'self'`, `object-src 'none'`, `base-uri 'self'` y las restricciones restantes. Una prueba multibrowser debe confirmar este cambio.
