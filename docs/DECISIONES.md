# Decisiones vigentes — Venezuela en el Mapa

Reconciliación: 26 de noviembre de 2026. Fuentes: instrucciones expresas del propietario en esta conversación, código y GitHub. Las propuestas históricas de docs/architecture.md no equivalen por sí solas a decisiones implementadas.

| Estado | Decisión y fundamento |
|---|---|
| [CONFIRMADO] | Nombre del producto: Venezuela en el Mapa; propietario AJ-Med!n@, cuenta medinacaj. Guía documental de Venezuela con catálogo público y aplicación editorial. |
| [CONFIRMADO] | Repositorio oficial https://github.com/medinacaj/descubriendo-vzla, ID 1445188413, rama main. Renombrado desde medinacaj/descubriendovenezuela; no es otro producto. El nombre del paquete continúa venezuela-en-el-mapa, versión 0.1.0. |
| [NO MODIFICAR] | Conservar datos, fuentes, licencias y paleta viva; no contratar servicios de pago. |
| [CONFIRMADO] | Unificar IDs públicos, catálogo, URLs y SEO entre Pages y Next. content/places.json es fuente versionada; importación idempotente preserva fichas independientes. |
| [CONFIRMADO] | Fotografías auténticas del lugar, autor/licencia visibles, ausencia explícita cuando faltan. Noticias con imágenes ilustrativas claramente etiquetadas. |
| [CONFIRMADO] | Noticias y agendas requieren contenido real y fuentes; conservar archivo. El control semanal detecta caducidad, no renueva fechas ni publica por sí mismo. |
| [CONFIRMADO] | Tarjetas con alturas coherentes entre filas, sin ocultar información; ajuste integrado en PR #35. No rehacerlo desde un prototipo antiguo. |
| [CONFIRMADO] | Borradores privados, DEMO y administración noindex; SITE_PUBLIC_READY más APP_ORIGIN HTTPS para habilitar indexación Next. Coordenadas sensibles no públicas; contactos autorizados y precios con evidencia vigente. |
| [CONFIRMADO] | Favoritos y plan de visitas son locales al navegador; no se acredita sincronización multidispositivo, reservas, pagos ni disponibilidad real. |
| [CONFIRMADO] | Automatizar validación, generación y publicación con GitHub Actions/Pages y recursos estándar; Pages no ejecuta Next ni PostgreSQL. Hosting público del backend, staging y dominio propio no verificados. |
| [CONFIRMADO] | Respaldar en rama remota y PR sin force push. La autorización actual excluye despliegues y cambios de infraestructura. |
| [CONFIRMADO] | Registrar fallos y verificaciones limitadas sin presentar CI como producción ni axe como certificación WCAG. |

## Cambios de criterio resueltos

1. El destino histórico descubriendovenezuela se sustituye por descubriendo-vzla por evidencia de GitHub (mismo ID y propietario). Esto no autoriza modificar automáticamente las rutas públicas antiguas: siguen codificadas en el generador, robots y pruebas, y necesitan reconciliación y verificación del sitio.
2. Las autorizaciones anteriores de fusión/publicación de PR #34–39 ya produjeron sus efectos. El respaldo actual no autoriza una nueva fusión o despliegue.
3. La propuesta técnica del 04/11 precede al catálogo nacional documentado, favoritos, plan local y funciones estáticas posteriores. Preservarla como historia; el estado vigente se describe en MEMORIA_OPERATIVA.md y la nota actual de arquitectura.
4. El PR #40 conserva su aportación del 21/11 y sirve como rama de continuidad ampliada en este respaldo. No se cierra ni descarta el trabajo previo.

## Límites que requieren evidencia o autorización adicional

No hay autorización para activar cobros, anuncios, reservas o datos comerciales no comprobados. No hay elección confirmada de hosting Node/PostGIS público. No modificar políticas de acceso, dominios o Pages durante el respaldo. La auditoría #36 continúa abierta; sus anotaciones históricas “sin fusionar” se interpretan junto a las fusiones posteriores documentadas, no como estado vigente.
