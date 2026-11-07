# Control de calidad web · auditoría verificable

- `scripts/test-pages.mjs` permite ejecutar pruebas responsivas y de flujos en Chromium, Firefox y WebKit con `BROWSER_ENGINE`.
- CI instalará los tres motores y ejecutará la navegación e interacciones sin errores por navegador.
- `scripts/audit-accessibility.mjs` ejecuta axe-core sobre portada, directorio, estados, página regional, ficha individual y privacidad. Falla si encuentra problemas `serious` o `critical` según reglas WCAG A/AA.
- Las pruebas automáticas no certifican WCAG 2.2 AA: quedan pendientes revisión de teclado, lector de pantalla, zoom y verificación manual de contraste.
- Las métricas Core Web Vitals en campo (p75) requieren tráfico real; un CI verde no las sustituye.
