# Proyecto Final · Gestor de Metas

## 1. Objetivo general

Construir una aplicación fullstack para que los usuarios registren, consulten y gestionen metas personales. Debe cubrir autenticación, autorización por roles y un CRUD completo de metas, con foco en buenas prácticas de Angular, Node.js, Express y MongoDB.

## 2. Modelo de datos mínimo

### Meta

- `nombre u objetivo` (string, requerido)
- `fechaCumplimiento` (date, requerido)
- `estado` (enum: pendiente | en_progreso | completada | cancelada) con valor por defecto `pendiente`
- `creadaPor` (ObjectId que referencia a `Usuario`, requerido)
- El alumno puede crear más atributos según su criterio (ej: `descripcion`, `prioridad`, `createdAt`, `updatedAt`)

### Usuario

- `nombreCompleto` (string, requerido)
- `email` (string, único, requerido)
- `password` (string hasheado, requerido)
- `rol` (enum: usuario | admin) — soporte para `admin` es opcional, pero si existe debe respetar las reglas de autorización

## 3. Roles y permisos

- Rol `usuario`: crear metas, leer y actualizar únicamente las propias.
- Rol `admin` (opcional): CRUD completo sobre todas las metas, incluida la opción de cancelarlas/eliminarlas.
- Independiente del rol, cada petición protegida debe incluir un JWT válido.

## 4. Backend

### Tecnologías

- Node.js
- Express
- JWT para autenticación basada en tokens
- Mongoose como ODM para MongoDB

### Endpoints requeridos

| Método          | Ruta                 | Descripción                                                  |
| --------------- | -------------------- | ------------------------------------------------------------ |
| POST            | `/api/auth/login`    | Autenticar usuarios y devolver un JWT con datos básicos.     |
| POST (opcional) | `/api/auth/register` | Registrar usuarios y devolver el token tras la creación.     |
| POST            | `/api/metas`         | Crear una meta asociada al usuario autenticado.              |
| GET             | `/api/metas`         | Listar metas. Puede incluir filtros por `estado` (opcional). |
| PUT             | `/api/metas/:id`     | Actualizar una meta. Validar propiedad o rol admin.          |
| PATCH/DELETE    | `/api/metas/:id`     | Marcar una meta como `cancelada` (solo admin).               |

### Middleware y seguridad

- Middleware para validar y decodificar el token JWT, inyectando el usuario en `req.user`.
- Middleware de autorización que compare `req.user.id` con la meta o verifique el rol `admin`.
- Manejo centralizado de errores y respuestas consistentes (opcional).

### Creación de índices

- Índice en `Meta.fechaCumplimiento` para consultas por fecha.
- Índice en `Meta.estado` para filtros por estado.

## 5. Frontend

### Tecnologías

- Angular
- Angular Material (opcional)
- RxJS para estados y peticiones reactivas (opcional, recomendado)

### Rutas

- Públicas:
  - `/login`
- Protegidas (requieren guardia):
  - `/metas`
  - `/metas/nueva`
  - `/metas/:id/editar`
- (Opcional) Guardia adicional que evite mostrar `/login` a usuarios ya autenticados.

### Componentes clave

- `Login`: formulario reactivo con email y contraseña, conexión al servicio de autenticación.
- `MetasList`: tabla o lista que muestre metas con filtros por estado.
- `MetaCreate`: formulario para crear nuevas metas.
- `MetaDetail` o `MetaEdit`: formulario para actualizar metas existentes y, si el usuario es admin, acción para cancelarlas (opcional).

### Servicios e interceptores

- Servicio de autenticación con métodos `login`, `logout`, `isAuthenticated`, `getUser`, `getToken`.
- Servicio de metas con métodos `list`, `create`, `update`, `cancel`.
- Interceptor HTTP que adjunte el token JWT al header `Authorization`.

## 6. Consideraciones adicionales (Opcionales)

- Validaciones tanto en frontend como backend (campos requeridos, formatos, estados permitidos).
- Mensajes de error claros y retroalimentación visual en formularios.
- Estructura del repositorio alineada con las lecciones previas (Angular CLI + capas de servicios).
- Documentar pasos para ejecutar backend y frontend (scripts npm, variables de entorno).
