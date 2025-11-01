# Clase 1: Comunicación entre Angular y Node.js mediante APIs REST

Esta clase aborda los conceptos fundamentales de Comunicación entre Angular y Node.js mediante APIs REST, elementos esenciales para construir aplicaciones web modernas.

## Estructura del contenido

- **docs/**: Presentación teórica sobre Comunicación entre Angular y Node.js mediante APIs REST
- **project/**: Archivos de la sesión práctica con ejemplos de implementación
  - **incident-desk-api/**: API REST para el sistema de incidencias
  - **incident-desk-ui/**: Interfaz de usuario para el sistema de incidencias

## Guía

Esta guía describe paso a paso cómo recrear el backend (`incident-desk-api`) y el frontend (`incident-desk-ui`) exactamente como aparecen en `module-3/2-fullstack/lesson-1/project`. El foco de la sesión es mostrar la comunicación Angular ⇆ Node.js mediante un contrato REST consistente.

## 1. Backend – incident-desk-api

1. **Inicializar el proyecto**
   ```bash
   # Crea la carpeta y navegar a ella
   mkdir incident-desk-api && cd incident-desk-api
   # Inicia el proyecto
   npm init -y
   # Instala las dependencias necesarias
   npm install express cors dotenv
   # Instala las dependencias de desarrollo
   npm install -D typescript tsx ts-node @types/node @types/express @types/cors eslint eslint-config-prettier eslint-plugin-import
   # Crea el archivo de configuración de TypeScript tsconfig.json
   echo '{
      "compilerOptions": {
        "target": "es2021",
        "module": "nodenext",
        "moduleResolution": "nodenext",
        "esModuleInterop": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "skipLibCheck": true,
        "resolveJsonModule": true,
        "outDir": "dist",
        "types": [
          "node"
        ]
      },
      "include": [
        "src/**/*.ts"
      ]
    }' > tsconfig.json
   ```
2. **Configurar linting** – crea `.eslintrc.cjs` con la combinación de reglas TypeScript + Prettier usada en el curso.
3. **Estructura de carpetas** – organiza `src/` con:
   - `app.ts`: instancia Express, registra middlewares (`cors`, `express.json`) y monta las rutas bajo `/api`.
   - `server.ts`: lee `.env`, obtiene `PORT` (8080 por defecto), arranca el servidor y registra logs.
   - `routes/`: `incidents.route.ts`, `users.route.ts`.
   - `types/`: `incident.ts`, `user.ts` con los tipos compartidos.
   - `data/`: `incidents.ts`, `users.ts` con los arrays en memoria.
4. **Definir modelos** – en `src/types/incident.ts` y `src/types/user.ts` exporta los tipos `Incident`, `User`, `IncidentStatus`, `IncidentSeverity` que después se reutilizan en Angular.
5. **Mock data** – llena `src/data/users.ts` y `src/data/incidents.ts` con objetos en español alineados a la narrativa del módulo. Usa utilidades (`Map`) para mapear IDs a nombres.
6. **Rutas REST**
   - `GET /api/health` (en `app.ts`) responde con `status`, `uptime`, `timestamp`.
   - `GET /api/incidents` (en `incidents.route.ts`) retorna todos los incidentes.
   - `GET /api/users` (en `users.route.ts`) retorna el catálogo completo de usuarios.
     Exporta cada `Router` desde su archivo y móntalo en `app.ts` con `app.use('/api/incidents', incidentsRouter)` y `app.use('/api/users', usersRouter)`.
7. **Servidor** – en `server.ts` carga variables mediante `dotenv`, importa `app` y llama a `app.listen`. Configura CORS para `http://localhost:4200`.
8. **Scripts npm** – agrega en `package.json`:
   ```json
   {
     "scripts": {
       "dev": "tsx watch src/server.ts",
       "build": "tsc",
       "start": "node dist/server.js",
       "lint": "eslint \"src/**/*.{ts,js}\"",
       "typecheck": "tsc --noEmit"
     }
   }
   ```
9. **Ignorar artefactos** – crea `.gitignore` con `node_modules/`, `dist/`, `.env*`, `*.tsbuildinfo`, archivos de log.
10. **Ejecutar en desarrollo**
    ```bash
    npm run dev
    # verifica http://localhost:8080/api/health
    ```

## 2. Frontend – incident-desk-ui

1. **Crear el proyecto Angular**
   ```bash
   cd module-4/lesson-01/project
   ng new incident-desk-ui --routing --style=scss --standalone --skip-git --skip-install
   cd incident-desk-ui
   ```
2. **Instalar Angular Material (v20) y dependencias**

   ```bash
   npm install @angular/material
   ```

   > Selecciona “Azure/Blue” como tema.

3. **Modelos de dominio**

- `src/app/features/incidents/incident.model.ts`: define `IncidentStatus`, `IncidentSeverity`, `Incident`.
- `src/app/features/users/user.model.ts`: define `User`.
  Asegúrate de que los campos coincidan con los tipos del backend (`status`, `severity`, `assignedToName`, `updatedAt`, etc.).

4. **Servicio HTTP central**

- Archivo: `src/app/core/api.service.ts`.
- Métodos: `getIncidents()`, `getUsers()`.
- Utiliza `HttpClient`.

5. **Ruteo modular**
   - `src/app/features/incidents/incidents.routes.ts`:
     ```ts
     export const incidentsRoutes: Routes = [
       {
         path: 'incidentes',
         component: IncidentList,
         title: 'Incidentes | Tablero de Incidentes',
       },
       { path: '', pathMatch: 'full', redirectTo: 'incidentes' },
     ]
     ```
   - `src/app/features/users/users.routes.ts`:
     ```ts
     export const usersRoutes: Routes = [
       {
         path: 'usuarios',
         component: UsersList,
         title: 'Usuarios | Tablero de Incidentes',
       },
     ]
     ```
   - `src/app/app.routes.ts` combina ambos arreglos y agrega el wildcard:
     ```ts
     export const appRoutes: Routes = [
       ...incidentsRoutes,
       ...usersRoutes,
       { path: '**', redirectTo: 'incidentes' },
     ]
     ```
6. **Feature Incidentes**
   - **Lista (`features/incidents/incident-list/`)**
     - `incident-list.ts`: componente standalone; importa `MatTableModule`, `MatCardModule`, `RouterLink`, `AsyncPipe`, `DatePipe`. `displayedColumns` = `['reference','title','status','severity','assignedTo','reportedBy','updatedAt']`.
     - `incident-list.html`: tabla Material. El código del incidente es un enlace `<a [routerLink]="['/incidentes', incident.id]" class="reference-link">`.
     - `incident-list.scss`: define `th` en mayúsculas, `.reference-link` con `:hover`, y las clases de estado (`.status-new`, `.status-ack`, `.status-in_progress`, etc.).
7. **Feature Usuarios**
   - Ubicación: `src/app/features/users/user-list/`.
   - `user-list.ts`: standalone; importa `MatTableModule`, `MatCardModule`, `AsyncPipe`. Carga `users$` invocando `api.getUsers()`.
   - `user-list.html`: `mat-card` con tabla Material y columnas `fullName`, `email`, `role`, `isActive`.
   - `user-list.scss`: ajusta espaciados de la tarjeta según sea necesario (el archivo puede mantenerse mínimo).
8. **App component**
   - `src/app/app.ts`: componente raíz standalone. Importa `RouterOutlet`, `RouterLink`, `RouterLinkActive`, `MatToolbarModule`, `MatButtonModule`, `MatIconModule`. Expone `links = [{ label: 'Incidentes', path: '/incidentes', icon: 'report_problem' }, …]`.
   - `src/app/app.html`: toolbar Material con iconos (`mat-icon`), enlaces activos y `<router-outlet>` dentro de `<main class="content">`.
   - `src/app/app.scss`: define `.top-bar`, `.spacer`, `.content` y `.active-link`.
9. **Configuración global**
   - `src/app/app.config.ts`: exporta `appConfig: ApplicationConfig` que provee router (con `provideRouter(appRoutes)`), y `HttpClient` (con `provideHttpClient()`).
   - `src/styles.scss`: aplica el tema global de Material.
   - `src/index.html`: incluye Roboto e íconos Material mediante `<link>` y asigna `class="mat-typography"` al `<body>`.
10. **Bootstrap**
    - `src/main.ts`: llama `bootstrapApplication(AppComponent, appConfig)` y captura errores con `console.error`.
    - Mantén `src/app/app.spec.ts` actualizado si decides añadir pruebas unitarias.
11. **Ejecución local**
    ```bash
    npm install
    npm start
    # abrir http://localhost:4200/incidentes
    ```
    Levanta en paralelo el backend (`npm run dev` en `incident-desk-api`) para que la app consuma `http://localhost:8080/api`. Verifica navegación, lista de incidentes y la carga del módulo de usuarios.
