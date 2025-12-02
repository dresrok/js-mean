## OWASP Top 10 aplicado al Incident Desk

**A01 Broken Access Control**

- Idea clave: Asegurar que solo usuarios autorizados accedan los recursos
- **Riesgo**: Usuarios ejecutan acciones o leen datos fuera de su rol.
- Lo que ya existe en el repo: Middleware `requireAuth`, `authorize` y `permissionGuard` limitan rutas. `*ngIf/@if` para ocultar o mostrar botones críticos.

**A02 Cryptographic Failures**

- Idea clave: Gestión correcta de secretos, TLS, hashing
- **Riesgo**: Llaves débiles o transporte inseguro → tokens filtrados.
- Lo que ya existe en el repo: Contraseñas con `bcrypt`, JWT firma configurable en `.env`
- **Agregar**: Rotación documentada de secretos `JWT_ACCESS_SECRET`, verificación de `.env` al arrancar y HTTPS obligatorio en despliegues.

**A03 Injection**

- Idea clave: Validar datos para evitar queries maliciosas
- **Riesgo**: Payloads maliciosos en MongoDB/plantillas.
- Lo que ya existe en el repo: Mongoose valida schema pero controllers aceptan payloads crudos
- **Agregar**: Agregar validaciones con `Zod` para crear incidente.

**A04 Insecure Design**

- Idea clave: Prever escenarios maliciosos en el flujo
- **Riesgo**: Falta de controles en flujo (reintentos, caducidad, abuso).
- Lo que ya existe en el repo: Roles están definidos
- **Agregar**: Registrar qué debe ocurrir tras varios logins fallidos o tokens caducados (ej. sesión forzada a logout).

**A05 Security Misconfiguration**

- Idea clave: Cabeceras, CORS, versiones expuestas
- **Riesgo**: Ausencia de cabeceras por defecto, CORS abierto.
- Lo que ya existe en el repo: Express monta `cors` genérico
- **Agregar**: Integración de `helmet` para proteger contra ataques comunes.

**A06 Vulnerable & Outdated Components**

- Idea clave: Dependencias desactualizadas
- **Riesgo**: dependencias sin parche → vulnerabilidades explotables.
- Lo que ya existe en el repo: `package-lock` actualizado
- Ejecutar `npm audit --production` y registrar hallazgos para seguimiento.

**A07 Identification & Authentication Failures**

- Idea clave: Gestión del ciclo de vida de sesión
- **Riesgo**: abuso de login, sesiones sin caducar, tokens expuestos.
- Lo que ya existe en el repo: UI persiste tokens, `auth.interceptor` responde a 401
- **Agregar**: logout proactivo en UI usando `exp` y notificaciones antes de expiración para UX.

**A08 Software & Data Integrity Failures**

- Idea clave: Garantizar que el código cargado es de confianza
- **Riesgo**: ejecutar builds manipuladas o scripts no verificados.
- Lo que ya existe en el repo: No hay pipelines documentadas
- **Agregar**: `npm ci` en CI, script `npm run verify:integrity`, checksums para seeds y revisión de scripts externos.

**A09 Security Logging & Monitoring Failures**

- Idea clave: Alertar y auditar comportamientos sospechosos
- **Riesgo**: no detectar patrones anómalos (403, 429, errores).
- **Agregar**: `error-handler` para errores genéricos y `pinoHttp` para logs de request y response.

**A10 Server-Side Request Forgery (SSRF)**

- Idea clave: Validar destinos remotos
- **Riesgo**: backend realiza requests a destinos no confiables.
- Lo que ya existe en el repo: Actualmente no consume endpoints externos
- **Agregar**: para futuras integraciones, aplicar allowlist de hosts/protocolos y bloquear IPs internas/metadata cloud.

Documentación Oficial: [OWASP Top 10 - 2021](https://owasp.org/Top10/A00_2021_Introduction)
