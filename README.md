# GCP en un modelo de factores con regularización ridge

Desafío individual de Métodos Numéricos (UMSA, Informática). Mención: IA y Ciencia de Datos.

Estima la sensibilidad (β) de un portafolio de empresas de IA a 5 factores de riesgo
(Mercado, Tamaño, Valor, Momentum, Semiconductores) con regresión ridge. Las ecuaciones normales
dan Aβ = b, con A simétrica definida positiva, resuelto con Gradientes Conjugados Precondicionado
(Suñagua, 2020), comparado con GC simple y con Cholesky (solución de referencia).

## Estructura
- `index.html`: página principal (aplicación de una sola página con 10 rutas: #inicio ... #conclusiones)
- `css/styles.css`: estilos, tema claro/oscuro y animaciones
- `js/core.js`: datos simulados, Cholesky, GC, GCP, números de condición
- `js/charts.js`: gráficas SVG (barras, líneas, mapa de calor)
- `js/app.js`: enrutador, las 10 páginas y el módulo QA

## Ejecución local
Abre `index.html` en el navegador, o con servidor: `python3 -m http.server` y visita http://localhost:8000
Publicación: GitHub Pages (Settings > Pages > rama main, carpeta raíz).
