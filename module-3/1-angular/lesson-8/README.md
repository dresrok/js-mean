# Clase 8: Proyecto Final Impulso JavaScript

Esta clase aborda ek de Proyecto Final Impulso JavaScript.

## Estructura del contenido

- **docs/**: Presentación teórica sobre Proyecto Final Impulso JavaScript
- **project/**: Archivos de la sesión práctica con ejemplos de implementación
  - **team-dashboard/**: Proyecto de dashboard de equipos
  - **search-movies/**: Proyecto de buscador de películas

## Cómo ejecutar el proyecto

### Prerequisitos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)

### Instalación

1. Navega al directorio del proyecto:

```bash
cd module-3/lesson-7/project/team-dashboard
```

2. Instala las dependencias:

```bash
npm install
```

### Ejecución

#### Desarrollo (Recomendado)

Para ejecutar el servidor de desarrollo de Angular y la API REST simultáneamente:

```bash
npm run dev
```

- La aplicación Angular estará disponible en: `http://localhost:4200`
- El servidor JSON Server (API) estará disponible en: `http://localhost:3000`

#### Solo servidor Angular

Para ejecutar únicamente el servidor de desarrollo de Angular:

```bash
npm start
```

#### Solo API REST

Para ejecutar únicamente el servidor JSON Server:

```bash
npm run api
```

### Otros comandos útiles

- **Build de producción:**

```bash
npm run build
```

Los archivos compilados se generarán en el directorio `dist/`.

- **Ejecutar tests:**

```bash
npm test
```

- **Ejecutar linter:**

```bash
npm run lint
```
