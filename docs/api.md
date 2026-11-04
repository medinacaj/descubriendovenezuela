# API de la demo

GET `/api/places?q=&category=&territory=&page=1`: `items`, `total`, `page`, `pages`; 12 fichas por página, solo publicadas; búsqueda parametrizada y texto limitado a 120 caracteres. El territorio incluye descendientes. Fallo de base devuelve 503, no una lista vacía. Coordenadas sensibles son null.

GET `/api/territories`: árbol plano con id, name, kind, parent_id. Demo contiene una jerarquía sintética etiquetada; no es catálogo oficial.

POST `/api/admin/login`: formulario email/password, sesión HttpOnly SameSite=Strict con caducidad de 8 horas. 10 intentos fallidos por cuenta en una ventana de 15 minutos; un acceso correcto limpia el contador.

POST `/api/admin/logout`: revoca sesión. POST `/api/admin/places`: crea o actualiza si incluye id; requiere sesión y Origin autorizado. Campos documentados en formulario y esquema `src/lib/domain.ts`. Validación con Zod y transacción de escritura/auditoría. Sin permisos devuelve 401; origen incorrecto 403; éxito redirige 303. Error de validación vuelve al panel sin guardar.

`/lugares/[id]` devuelve 404 para borradores y IDs inválidos. No hay todavía API de imágenes, geoconsultas por radio, negocios, creadores ni importación pública. No prometer contratos para endpoints inexistentes.
