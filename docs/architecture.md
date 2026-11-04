# Venezuela en el Mapa: diseño de la primera entrega

Fecha: 4 de noviembre de 2026. Estado: propuesta técnica para implementación; no describe una plataforma ya construida.

## Objetivo y alcance

Preparar un MVP que permita explorar información territorial, buscar lugares publicados, consultar fichas y administrarlas con revisión humana y auditoría. La región piloto y sus fuentes quedan pendientes. No se cargan establecimientos, imágenes ni coordenadas inventadas. Sin datos aprobados, el explorador muestra un estado vacío explícito.

La especificación maestra aportada por el usuario rige las fases posteriores. Esta entrega no incluye reservas, pagos, anuncios activos, planificación con IA, traducciones, funcionamiento offline, cuentas de propietarios ni marketplace de creadores. No se presentarán como funciones disponibles.

## Decisiones propuestas

- Next.js App Router y TypeScript: páginas públicas renderizadas en servidor y API en una sola aplicación. Tailwind para estilos; interfaz en español, adaptable a móvil y teclado. Usar versiones estables compatibles y fijarlas en el lockfile al implementar.
- PostgreSQL con PostGIS: búsquedas territoriales y espaciales, integridad referencial y auditoría transaccional. Docker Compose local con imagen versionada, volumen persistente y puerto limitado a loopback. Docker local responde; aún no se ha descargado una imagen ni probado PostGIS.
- MapLibre GL JS para el mapa. Configuración explícita del proveedor de estilo y mosaicos, atribución visible y respeto a sus condiciones. Sin proveedor autorizado, la lista sigue funcionando y el mapa explica la falta de configuración; no consume servidores públicos indiscriminadamente.
- Almacenamiento local de imágenes para desarrollo, fuera del árbol público. API controlada para servir únicamente archivos aprobados. Adaptador futuro para objetos y CDN; no contratar almacenamiento.
- Pruebas de dominio y API con Vitest; pruebas de integración contra PostGIS y recorridos con Playwright. Incluir compilación de producción y chequeo de tipos.

Se propone esta combinación frente a un prototipo exclusivamente visual, que no comprobaría persistencia ni moderación, o una arquitectura distribuida, que elevaría costos y operación antes de tener contenido.

## Modelo de datos

Todos los registros usan UUID y fechas UTC. URLs con slug más identificador estable; los cambios de nombre conservan redirección al identificador.

1. `territories`: entidad federal, municipio, parroquia y localidad mediante tipo y padre; alias separados, fuente, código oficial si existe, fecha de revisión. Validar relaciones de tipos. No asumir que municipio o parroquia son globalmente únicos. El catálogo nacional se importa solo desde fuentes documentadas; sin fuente no afirmar cobertura completa.
2. `places`: territorio, nombre, categoría, descripción, dirección, precisión, geometría privada, política de divulgación, estado de verificación y estado de publicación independientes. Un lugar verificado puede seguir sin publicar. Negocio como extensión opcional del lugar, sin duplicar coordenadas.
3. `sources`, `place_sources`, `verification_events`: URL o referencia documental, procedencia, evidencia y responsable. Publicar requiere fuente, revisión y aprobación. La insignia muestra qué se verificó, sin prometer seguridad o disponibilidad.
4. `prices`: importe decimal, moneda, unidad, vigencia, condiciones y fuente. Sin tarifa vigente comprobada mostrar «Consultar precio». No convertir monedas.
5. `media_assets`, `media_licenses`: autor, autorización/licencia, atribución, texto alternativo, archivo y estado de moderación. Solo medios aprobados se sirven públicamente.
6. `admin_users`, `sessions`, `change_log`: acceso, sesiones y registro de cambios antes/después. La auditoría no registra contraseñas ni tokens. Creación, revisión, publicación y retirada en una transacción con su evento.

Los módulos de creadores, contribuciones y publicidad tendrán migraciones propias en fases posteriores. Identidad verificada y patrocinio serán campos independientes; ninguna publicidad alterará silenciosamente el orden orgánico.

## API y seguridad

- `GET /api/territories?parentId=`: hijos del territorio solicitado.
- `GET /api/places?q=&territoryId=&category=&page=`: solo publicados, paginación limitada y orden estable. Texto parametrizado y límites de longitud; sin coordenadas sensibles en respuestas o metadatos.
- `GET /api/places/[id]`: ficha pública o 404, incluyendo para borradores.
- Administración bajo `/admin`: inicio/cierre de sesión, listado, creación, edición y acciones explícitas de revisión, publicación y retirada. Cada operación de escritura comprueba sesión y rol en servidor.
- Contraseñas con hash robusto; sesiones opacas con caducidad, cookies HttpOnly y SameSite, Secure en producción. Validación de origen/CSRF en escrituras, límites de intentos de acceso y consultas, validación de entradas y encabezados de seguridad. Sin contraseña predeterminada.
- Geolocalización únicamente tras acción y permiso del visitante; no persistir su ubicación. Filtrar lugares sensibles en servidor. Si se publica ubicación aproximada, usar una posición generalizada aprobada distinta de la original.
- Imágenes con tamaño limitado, identificación real de formato, recodificación, eliminación de metadatos y rutas generadas. No servir SVG aportado por usuarios ni aceptar URLs arbitrarias para descarga.

## Páginas y comportamiento

- `/`: buscador, acceso al explorador y explicación del proyecto; no contadores, recomendaciones ni testimonios simulados.
- `/explorar`: lista, filtros territoriales y por categoría, paginación y mapa sincronizado cuando esté configurado. Filtros en URL, estados de carga, vacío y error diferenciados.
- `/lugares/[id]/[slug]`: ficha con fuente y revisión, precisión de ubicación, atribución y precio opcional. No hacer públicas las fichas pendientes.
- `/territorios/[id]/[slug]`: contexto territorial y lugares publicados; evitar indexar páginas vacías.
- `/admin`: panel protegido con estados, evidencias y registro de cambios. No incluir acceso administrativo en navegación turística principal.
- Páginas de privacidad y política editorial deben reflejar la operación implementada. Metadatos, canonical, sitemap solo de contenido publicado y datos estructurados acordes a datos reales.

No se mostrarán enlaces a módulos futuros como si funcionaran. Sin fichas, se puede usar y validar el flujo administrativo local; eso no demuestra cobertura turística ni funcionamiento con datos de campo.

## Operación, costos y validación

Desarrollo local sin contratación: Node.js ya disponible, Docker local y almacenamiento en disco. Variables: `DATABASE_URL`, `APP_ORIGIN`, configuración opcional del proveedor cartográfico y configuración segura de sesión. Guardar únicamente nombres y ejemplos no secretos. Inicializar administrador mediante comando local que solicite contraseña sin registrarla.

Separar instalación, migración, creación de administrador y arranque. Migraciones repetibles; no borrar datos para actualizar. Copias con `pg_dump`, archivos de medios y ensayo de restauración en base separada. Documentar que el volumen local no constituye un respaldo externo ni garantiza persistencia del proveedor.

No elegir hosting gratuito como garantía de disponibilidad. Comparar después límites de CPU, memoria, suspensión, base de datos persistente, almacenamiento, copias, correo, egreso y mapas. Ningún ingreso está supuesto. Publicación, gastos y cambios irreversibles requieren autorización del usuario.

Criterios de la primera entrega: persistencia tras reinicio; acceso anónimo bloqueado a escrituras y borradores; publicación exige evidencia; filtros producen resultados correctos usando fixtures exclusivos de prueba; ubicaciones sensibles ausentes de API/HTML/metadata; precio desconocido explícito; medios sin licencia rechazados; auditoría consistente; navegación móvil y teclado; build y pruebas completados. No se declarará el MVP editorial completo hasta probar fichas reales autorizadas y mapa con proveedor configurado.

## Fases siguientes

1. Documentación e importación del piloto: fuentes territoriales, autorizaciones y verificación humana de las primeras fichas; validación de mapa real y atribución.
2. Comunidad y creadores: aportes, reclamaciones, moderación, perfiles y vínculos autorizados; identidad y patrocinio separados.
3. Monetización: campañas manuales etiquetadas, métricas reales y evaluación de AdSense, sin activación anticipada.
4. Expansión: rutas calculadas, idiomas, PWA y asistencia basada exclusivamente en registros existentes.
