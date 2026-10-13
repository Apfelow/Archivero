# Frontend (HTML, CSS, JS)

## Estructura

```
frontend/
├── index.html            -> menú principal (barra lateral + catálogos)
├── css/
│   ├── main.css          -> archivo principal (importa los demás)
│   ├── variables.css     -> colores, fuente, medidas
│   ├── base.css          -> estilos generales
│   ├── components.css    -> botones, inputs, tarjetas, tablas
│   └── portal.css        -> menú principal (barra lateral y botones)
├── js/
│   ├── main.js           -> funciones compartidas (iconos, ojito, etc.)
│   ├── portal.js         -> abrir/cerrar la barra lateral
│   └── usuarios.js       -> lógica de Gestión de usuarios
├── img/                  -> logo-its.png y demás imágenes
└── pantallas/
    ├── _plantilla.html   -> copiar para una pantalla nueva
    └── usuarios.html
```

## Cómo agregar una pantalla nueva

1. Copiar `pantallas/_plantilla.html` y renombrarlo (ej. `consulta-documentos.html`).
2. Dejar el `<link>` a `../css/main.css`; con eso se trae todo el diseño.
3. Usar las clases de `css/components.css` (`.tarjeta`, `.input`, `.boton-primario`, `.tabla`...).
4. Si necesita JavaScript, crear su archivo en `js/`.
5. Agregar el link en `frontend/index.html` (en la barra lateral y en el cuadro principal), quitando el `data-pendiente` de ese enlace.

Los colores SOLO se cambian en `css/variables.css`.

## Cómo verlo

Abrir `frontend/index.html` en el navegador, o con la extensión Live Server de VS Code.
