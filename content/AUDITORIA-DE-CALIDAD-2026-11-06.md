# Auditoría de calidad y criterios de aceptación · 6 de noviembre de 2026

## Alcance y arquitectura real
Proyecto mixto: guía **estática y pública** en GitHub Pages y backend **Next.js/PostgreSQL** aún sin despliegue productivo equivalente. La publicación no ofrece login, cuentas, pagos, reservas ni acceso directo a API privada. La evaluación aplica los controles según riesgo y no presupone servicios de pago.

## Implementado y comprobado
- Catálogo con **234 destinos documentales**, indexados por 25 territorios, páginas permanentes, fuentes y límites de verificación; 52 fotografías con licencias y 5 mapas.
- 177 fichas usan imágenes acreditadas de otro destino con un aviso visible de **imagen referencial**. No están completas en cuanto a fotografía propia.
- Vistas Tarjetas / Lista / Fichas; búsqueda por texto, categoría y territorio; carga progresiva de 30 resultados por acción.
- Hoja de CSS compartida cacheable, imágenes locales optimizadas WebP y carga diferida en tarjetas.
- Meta canonical, descripciones y etiquetas sociales, sitemap, páginas de estados y rutas. Existe `docs/robots.txt` dentro del proyecto, pero **NO es el robots.txt de la raíz de medinacaj.github.io**.
- GitHub Actions ejecuta pruebas TypeScript, Vitest, PostgreSQL/PostGIS, compilación Next y navegador Chromium para 320, 390, 768, 1024, 1440 y 1920 px; también verifica generación reproducible de archivos y ubicación de medios.
- Publicación verificada en GitHub Pages; fuente de datos única `content/places.json` y manifiesto fotográfico `content/licensed-photographs.json`.

## Implementado sin verificación de cumplimiento integral
- HTML semántico, foco visible, alt en imágenes, etiquetas de formularios, estados de búsqueda.
- Política editorial y privacidad aplicables a la versión estática; atribuciones Creative Commons con enlaces a la licencia y al original.
- Controles de autenticación, sesiones y SQL parametrizado **solo en el backend de desarrollo**. No se ha ejecutado auditoría de penetración externa, verificación integral OWASP ASVS ni análisis de secretos y configuración del entorno productivo.

## Pendiente y no aplicable por ahora
| Área | Estado | Evidencia necesaria |
|---|---|---|
| WCAG 2.2 AA | Pendiente | Pruebas de contraste, teclado, lector de pantalla, zoom y cambios dinámicos, manuales + automatizadas |
| Core Web Vitals | Pendiente | LCP, INP, CLS reales en p75 y Lighthouse en móvil/escritorio |
| Compatibilidad cross-browser | Pendiente | Firefox, Safari/WebKit y navegadores móviles |
| Mapas interactivos precisos | Pendiente | Coordenadas verificadas, protección de lugares sensibles y experiencia táctil usable |
| SEO de buscadores | Parcial | Inspección indexación, URLs rastreables, Search Console, keywords y contenido único |
| Seguridad productiva | Pendiente condicional | OWASP, permisos de repositorio y workflows, secretos, dependencias, CSP/headers según hosting |
| Negocios y hospedajes | Pendiente | Operación actual, datos de contacto autorizados, horarios, tarifas y licencias pertinentes |
| Analítica y observabilidad | Pendiente | Medición proporcional y política de privacidad antes de activar seguimiento |
| Backup/restauración de backend | Pendiente condicional | Ensayo de recuperación en el servicio real de PostgreSQL cuando se despliegue |
| Legal/comercial | Pendiente | Identificación del responsable y revisión normativa local, derechos de imagen/PI y monetización |
| Usuarios, pagos, anuncios, reservas | No aplicable actualmente | Revaluar si llegan a incorporarse al producto |

## Riesgos y prioridades
1. **P1 editorial:** sustituir las 177 fotos referenciales por fotografías específicas con licencia validada, priorizando portada, destinos representativos y fichas de establecimientos. Revisar individualmente calidad de fuentes y nombre/localidad.
2. **P1 calidad:** auditar WCAG 2.2 AA en flujos esenciales y Lighthouse/Core Web Vitals con métricas reales; resolver defectos medidos.
3. **P1 condicional seguridad:** impedir despliegue del panel/admin sin revisión de permisos, sesiones, inputs y secretos según entorno.
4. **P2 funcional:** mapas basados en lugares realmente georreferenciados, evitando coordenadas inventadas.
5. **P2 crecimiento:** SEO estratégico y medición de tráfico respetuosa con privacidad, con herramientas gratuitas si son suficientes.

## Limitaciones y evidencias
No llamar conformidad plena a un build exitoso. Cada nuevo control debe registrar **implementado**, **verificado**, **pendiente**, **no aplicable** o **bloqueado**. No imponer Cloudflare, Supabase o servicios de pago. Los datos proceden de investigación documental y no demuestran horarios, servicios, tarifas o accesibilidad física vigentes.
