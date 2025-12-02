# Clase 5: Optimización de consultas en MongoDB

Esta clase aborda los conceptos fundamentales de Optimización de consultas en MongoDB, elementos esenciales para construir aplicaciones web modernas.

## Estructura del contenido

- **docs/**: Presentación teórica sobre Optimización de consultas en MongoDB
- **project/**: Archivos de la sesión práctica con ejemplos de implementación
  - **incident-desk-api/**: API REST para el sistema de incidentes
    - Para generar la clave de acceso, ejecutar el siguiente comando:
      ```bash
      npm run generate-key
      ```
      y copiar el resultado en el archivo `.env` en la variable `JWT_ACCESS_SECRET` de la API.
    - Para poblar la base de datos con datos de ejemplo, ejecutar el siguiente comando:
      ```bash
      npm run seed
      ```
  - **incident-desk-ui/**: Interfaz de usuario para el sistema de incidentes
