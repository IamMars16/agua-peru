# 💧 El agua que no vemos

Sitio web de **responsabilidad social** sobre disponibilidad hídrica en cinco cuencas del Perú.

Todas las figuras son **resultados propios** de un estudio hidrológico con datos oficiales.
Ninguna imagen es ilustrativa ni de banco.

## Publicación

El sitio está preparado como HTML, CSS y JavaScript estático para GitHub Pages.

## Estructura

```text
├── index.html
├── css/style.css
├── js/main.js
├── assets/img/
├── .nojekyll
└── README.md
```

Las figuras utilizadas en la versión web están optimizadas en formato WebP para reducir el tiempo de carga.

## Librerías externas

- AOS 2.3.4: animaciones al hacer scroll.
- Google Fonts: Inter y Fraunces.

## Accesibilidad

- Paleta Okabe-Ito, apta para daltonismo.
- Respeta `prefers-reduced-motion`.
- La animación de lluvia se pausa cuando la portada deja de estar visible.
- Imágenes con carga diferida y texto alternativo.

## Fuentes de los datos

- **SENAMHI** — PISCOp v3.0 y PISCOt v1.2.
- **NASA** — NEX-GDDP-CMIP6.
- **ISRIC** — SoilGrids 250 m.
- **ANA / SNIRH** — caudales observados.
- **INEI** — Censos Nacionales 2017 y 2025.

## Transparencia

- Los modelos hidrológicos no están calibrados contra caudal observado.
- La ETo se calculó por Hargreaves-Samani, no por Penman-Monteith.
- Los parámetros de suelo son estimaciones por pedotransferencia.
- La demanda está cuantificada parcialmente.

## Licencia

Contenido y figuras: CC BY 4.0 · Código: MIT
