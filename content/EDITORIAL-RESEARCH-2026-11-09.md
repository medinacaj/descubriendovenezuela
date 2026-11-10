# Revisión editorial · 9 de noviembre de 2026

Selección de seis publicaciones consultadas mediante navegación web, con resúmenes propios. Las fechas de las publicaciones no se sustituyen por la fecha de revisión. Se conservan las tres noticias anteriores en `editorial-news-archive.json`; la fuente de Fedecámaras Radio devolvió 403 en la reconsulta y no se mantiene como noticia activa sin nueva comprobación.

| Noticia | Publicación | Evidencia y alcance |
|---|---|---|
| Filven en Caracas | 2026-11-09 | [Convocatoria del Ministerio de Cultura](https://www.mincultura.gob.ve/noticias/con-el-lema-leer-es-renacer-la-22-a-filven-se-celebrara-en-caracas-del-13-al-23-de-noviembre/): fechas anunciadas del 13 al 23 de noviembre, GAN y Plaza de la Juventud. Agenda futura, no asistencia garantizada. |
| Protección del patrimonio | 2026-11-07 | [Ministerio de Cultura](https://www.mincultura.gob.ve/noticias/expertos-de-italia-y-venezuela-definen-estrategias-para-proteger-el-patrimonio-cultural-ante-desastres-naturales/): intercambio sobre protocolos de emergencia en el Museo de Arte Contemporáneo. No acredita condiciones actuales de visita. |
| SEMTUR en Táchira | 2026-11-07 | [Diario La Nación](https://lanacionweb.com/regional/semtur-2026-moda-arte-y-mucha-creatividad/): inicio informado el 5 y cierre previsto el 7. No se transforma ese cierre previsto en un hecho comprobado ni se ofrece como actividad vigente. |
| Balance AVAVIT | 2026-11-06 | [Informe Aéreo](https://informeaereo.com/turismo/venezuela-potencia-el-sector-turistico-mediante-alianzas-de-negocios/), contrastado con [Mintur del 5 de noviembre](https://www.mintur.gob.ve/news/a327c18a-7d51-439c-bb2a-9a662532615b): feria del 3 al 5 en Caracas y participación de Colombia. No se ofrecen vuelos ni reservas como confirmados. |
| Exposición en Valencia | 2026-11-03 | [Radio América](https://radioamerica.com.ve/inaugurada-exposicion-valencia-a-los-pies-de-su-patrona/): información atribuida a la Alcaldía sobre la muestra en Cavam. No se publican horarios ni entradas como operativamente verificados. |
| DiverFest | 2026-10-27 | [Delegación de la UE en Venezuela](https://www.eeas.europa.eu/delegations/venezuela/el-diverfest-2026-el-festival-internacional-de-artes-y-discapacidad-de-venezuela-regresa-con-un_und_sq): agenda anunciada del 2 al 21 de noviembre y fase presencial del 11 al 15. No implica inspección de accesibilidad. |

## Imágenes y derechos

Solo se utilizan fotografías ya acreditadas en el catálogo. Los pies identifican Caracas, San Cristóbal o el paisaje de Carabobo como contexto ilustrativo; no son fotos de los eventos, sus instalaciones ni las obras expuestas. No se descargaron ni reutilizaron las fotografías de los medios o comunicados consultados. Autor, fuente y licencia siguen visibles y se validan contra el catálogo.

## Mantenimiento

`npm run editorial:check` valida fechas reales, fuentes HTTPS, IDs únicos, evidencia mínima, intervalos de agendas y coincidencia de créditos. `--freshness` informa y falla si la selección o alguna noticia supera 14 días sin revisión, o si una agenda ya venció; nunca actualiza fechas por sí solo. El workflow semanal realiza esa comprobación sin publicar noticias automáticamente ni contratar servicios. La CI de cambios valida también el esquema antes de generar.
