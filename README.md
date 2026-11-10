# Colombian Commerce OS — Presentación interactiva

Propuesta comercial en formato web (scroll storytelling), 8 escenas + cierre.

## Ejecutar

```bash
npm install
npm run dev      # desarrollo
npm run build    # versión final en /dist (subible a Netlify, Vercel, etc.)
```

## Navegación
- Scroll / swipe
- `←` `→` o `PageUp` `PageDown`: escena anterior / siguiente
- `1`–`8`: ir directo a una escena
- Indicador lateral 01–08 (clic para saltar)

## Estructura
- `src/sections` — una escena por archivo
- `src/components` — piezas reutilizables (logo, contadores, panel, gráficos SVG, navegación)
- `src/animations` — curvas, variantes, hooks de scroll, scroll suave (Lenis) y parallax del mouse
- `src/data/content.js` — todo el texto, cifras demo y precio
- `src/lib` — formato numérico en español

## Personalizar
- Enlace del botón **COMENZAR PROYECTO**: `brand.ctaHref` en `src/data/content.js`
- Nombre de la tienda en el mockup: `brand.storeName`

Todas las cifras de ventas, clientes e inventario son ficticias (demo).
