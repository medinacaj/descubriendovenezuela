# Cartografía local

`countries.geojson` deriva de Natural Earth, escala 1:110m, dataset `ne_110m_admin_0_countries`, descargado el 4 de noviembre de 2026 desde:
https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson

Se conservaron geometrías y solo propiedades NAME/ADM0_A3, renombradas name/code. Licencia: dominio público, https://www.naturalearthdata.com/about/terms-of-use/ . Natural Earth representa límites generalizados y su perspectiva sobre disputas no equivale a una declaración legal. No es fuente administrativa oficial de Venezuela; no usar para navegación, catastro ni soberanía. La capa puede sustituirse tras revisión territorial/editorial.

El mapa no incorpora mosaicos, geocodificación o routing externos. `style.json` define colores y atribución local. La atribución es visible mediante MapLibre. Configurar NEXT_PUBLIC_MAP_STYLE solo tras revisar proveedor, términos, cuotas y licencias; esa variable se incorpora al build.
