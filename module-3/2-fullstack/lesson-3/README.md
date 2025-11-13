# Clase 3: Gestión de autenticación con JWT y Angular

Esta clase aborda los conceptos fundamentales de Gestión de autenticación con JWT y Angular, elementos esenciales para construir aplicaciones web modernas.

## Estructura del contenido

- **docs/**: Presentación teórica sobre Gestión de autenticación con JWT y Angular
- **project/**: Archivos de la sesión práctica con ejemplos de implementación
  - **incident-desk-api/**: API REST para el sistema de incidencias
    - Para generar la clave de acceso, ejecutar el siguiente comando:
      ```bash
      npm run generate-key
      ```
      y copiar el resultado en el archivo `.env` en la variable `JWT_ACCESS_SECRET` de la API.
  - **incident-desk-ui/**: Interfaz de usuario para el sistema de incidencias