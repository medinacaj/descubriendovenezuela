# Reglas permanentes — Venezuela en el Mapa

Leer primero docs/MEMORIA_OPERATIVA.md y docs/DECISIONES.md, después README y la documentación específica. Contrastar siempre con GitHub: el contexto de otro chat puede estar desactualizado.

- Producto autónomo de AJ-Med!n@ (medinacaj). Repositorio oficial https://github.com/medinacaj/descubriendo-vzla; ID estable 1445188413; principal main. El nombre anterior descubriendovenezuela corresponde al mismo repositorio renombrado. No aplicar reglas de PaseListo, MediOS u otros productos.
- [NO MODIFICAR] Conservar datos, fuentes, autores, licencias y paleta viva. No contratar servicios de pago.
- Catálogo versionado: content/places.json. Compartir catalog_id y URLs públicas entre Pages y Next; no sobrescribir fichas editoriales independientes ni volver a implementar funcionalidades existentes.
- Fotografías del lugar exacto y licencia compatible; ausencia explícita si faltan. Fotos de noticias identificadas como ilustrativas, sin atribuirlas al evento. Noticias con fuentes, fechas reales y revisión humana; archivar sin borrar historial. Nunca actualizar fechas para eludir el control de vigencia.
- No inventar apertura, precios, contactos, disponibilidad, seguridad de visita, verificación de campo ni afiliaciones de creadores. DEMO identificada; borradores ocultos y ubicaciones sensibles protegidas.
- No publicar .env, .data/, credenciales, dumps, sesiones ni datos privados. Solo nombres y ejemplos sintéticos de variables. Revisar cambios y archivos nuevos antes de cada commit.
- Pruebas de integración/E2E solo con bases y cuentas exclusivas desechables. tests/setup.ts utiliza venezuela_test: comprobar también el servidor y aislamiento antes de ejecutar. No seeds, resets, truncados ni migraciones destructivas sobre datos reales.
- No force push, reset destructivo ni sobrescribir trabajo remoto. Preservar avances incompletos en ramas identificadas; comparar árboles antes de integrar antiguos prototipos.
- El respaldo del 26/11/2026 autoriza commits, publicación de rama y PR; no autoriza desplegar, fusionar a main ni modificar infraestructura. La CI sobre main puede desplegar Pages; los PR validan sin desplegar.
- Separar código implementado, pruebas ejecutadas, integración remota, staging y producción. CI verde, DEMO o build no acreditan producción ni certificación WCAG.
- Verificar npm ci, editorial:check, build:pages, typecheck, build, npm test, test:pages y test:e2e según recursos; registrar exactamente resultados y omisiones. No existe script lint independiente en package.json.
- Actualizar memoria, decisiones y continuidad con evidencia, SHA base, PR, limitaciones y siguiente acción. No introducir el SHA del propio commit en el archivo que contiene.
