# Guía para Estudiantes · Gestor de Metas

Este repositorio ya tiene un **boilerplate del 25%** del proyecto final.
La idea es que puedas completar el 75% restante siguiendo los TODOs.

## Qué está implementado (25%)

### Backend (`final-project/backend`)

- Estructura completa de proyecto Node.js con Express y TypeScript.
- Conexión a MongoDB (`src/config/db.ts`).
- Middleware de autenticación JWT (`src/middleware/auth.middleware.ts`).
- Autenticación completa (Login, Register).
- Modelo de Usuario completo con hash de contraseña.
- Rutas de Metas `/api/metas` protegidas pero sin implementar (**Scaffold** con TODOs).

### Frontend (`final-project/frontend`)

- Estructura completa de proyecto Angular (Standalone Components).
- Autenticación funcional:
  - Login (`src/app/features/login`)
  - Guard (`src/app/core/guards/auth.guard.ts`)
  - Servicio Auth (`src/app/core/services/auth.service.ts`)
- Layout principal con navegación.
- Diseño visual base (estilos y componentes UI).
- Componentes de Metas (Listado y Creación) **solo scaffold** con TODOs.

## Qué debes implementar (75%)

### Backend

1. **Modelo de Metas**: Completar el esquema Mongoose en `src/models/goal.model.ts` (campos como `fechaCumplimiento`, `estado`, etc).
2. **Controlador de Metas**: Implementar la lógica CRUD en `src/controllers/goal.controller.ts`.
   - `getGoals`: Obtener metas del usuario.
   - `createGoal`: Crear nueva meta.
   - `updateGoal`: Actualizar meta existente.
   - `deleteGoal`: Eliminar meta.
3. **Rutas**: Asegurar que las rutas en `src/routes/goal.routes.ts` conecten correctamente.

### Frontend

1. **Servicio API**: Completar los métodos HTTP (GET, PUT, DELETE) en `src/app/core/services/api.service.ts`.
2. **Listado de Metas**: Implementar `src/app/features/goals/goal-list` para mostrar las metas reales del backend.
3. **Creación de Metas**: Implementar `src/app/features/goals/goal-create` con un formulario reactivo o template-driven.
4. **(Opcional)**: Edición y eliminación de metas.

## Orden sugerido de trabajo

1. **Backend**:
   - Definir Schema de Meta.
   - Implementar Crear Meta (POST) y Listar Metas (GET).
   - Probar con Postman o Curl.
2. **Frontend**:
   - Implementar métodos en `ApiService`.
   - Conectar el formulario de Creación.
   - Conectar el Listado.

## Tips rápidos

- **No uses `any`**. Tipar todo (usa interfaces).
- Revisa `src/models/auth.models.ts` para ver ejemplos de interfaces.
- Puedes separar la lógica de negocio en servicios en el backend si así lo deseas, o mantenerlo simple en los controladores.
