---
marp: true
theme: gaia
_class: lead
paginate: true
backgroundColor: #232126
---

<style scoped>
  h1 strong {
    color: #fbfbfb;
  }
  p, li {
    color: #fff;
  }
</style>

# **Clase 7**

Testing End-to-End con Cypress

---

<!-- backgroundColor: #f6f7f9 -->

# ¿Qué haremos hoy?

- Entender qué es el testing E2E y por qué es importante
- Instalar y configurar Cypress en Angular
- Escribir tests para flujos críticos: login, listado y creación
- Ejecutar tests en modo interactivo y headless

---

<!-- backgroundColor: #f6f7f9 -->

# El Problema: <small>¿Cómo sabemos que funciona?</small>

**Sin tests E2E**:

- Manual testing en cada cambio → Lento y propenso a errores
- Bugs en producción → Usuarios encuentran los errores
- Refactoring riesgoso → Miedo a romper funcionalidades
- Sin documentación viva → ¿Cómo debería funcionar esto?

---

<!-- backgroundColor: #f6f7f9 -->

# La Solución: <small>Testing E2E Automatizado</small>

**1. Simula usuarios reales:** Clicks, formularios, navegación completa

**2. Validación integral:** Frontend + Backend + Base de datos

**3. Confianza al refactorizar:** Los tests te avisan si algo se rompe

---

<!-- backgroundColor: #232126 -->

<style scoped>
  h1 strong {
    color: #fbfbfb;
  }
  p {
    color: #fff;
  }
</style>

# **Parte 1**

¿Qué es Cypress?

---

<!-- backgroundColor: #f6f7f9 -->

# Cypress vs Otras Herramientas

**Cypress** es un framework moderno de testing E2E que corre directamente en el navegador.

**Ventajas clave**:

- ✅ Sintaxis simple e intuitiva
- ✅ Auto-espera (no más `sleep` manual)
- ✅ Time-travel debugging
- ✅ Screenshots y videos automáticos

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  table {
    font-size: 80%;
  }
</style>

# Pirámide de Testing

```
        /\
       /  \      E2E Tests (pocos, lentos, costosos)
      /----\
     /      \    Integration Tests
    /--------\
   /          \  Unit Tests (muchos, rápidos, baratos)
  /____________\
```

**E2E Tests**: Prueban flujos completos desde la perspectiva del usuario.
**Enfoque**: Testear **casos críticos de negocio**, no cada detalle.

---

<!-- backgroundColor: #f6f7f9 -->

# Instalación y Configuración

```bash
cd incident-desk-ui
npm install --save-dev cypress
```

**Scripts en `package.json`**:

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run"
  }
}
```

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 90%;
  }
</style>

# Configuración: cypress.config.ts

```typescript
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 1, // Reintentos en CI
      openMode: 0,
    },
  },
})
```

---

<!-- backgroundColor: #232126 -->

<style scoped>
  h1 strong {
    color: #fbfbfb;
  }
  p {
    color: #fff;
  }
</style>

# **Parte 2**

Escribiendo tu primer test

---

<!-- backgroundColor: #f6f7f9 -->

# Anatomía de un Test Cypress

```typescript
describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login') // Navegar a la página
  })
  it('debería cargar el formulario', () => {
    // Arrange: Verificar estado inicial
    cy.get('input[type="email"]').should('be.visible')
    // Act: Realizar acción
    cy.get('input[type="email"]').type('admin@test.com')
    // Assert: Verificar resultado
    cy.get('input[type="email"]').should('have.value', 'admin@test.com')
  })
})
```

---

<!-- backgroundColor: #f6f7f9 -->

# Comandos Básicos de Cypress

| Comando         | Descripción                    |
| --------------- | ------------------------------ |
| `cy.visit()`    | Navega a una URL               |
| `cy.get()`      | Selecciona elementos del DOM   |
| `cy.contains()` | Busca texto en el DOM          |
| `cy.type()`     | Escribe en un input            |
| `cy.click()`    | Hace click en un elemento      |
| `cy.should()`   | Verifica una condición         |
| `cy.url()`      | Obtiene/verifica la URL actual |

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 70%;
  }
</style>

# Test 1: Verificar Página de Login

```typescript
describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('debería cargar la página correctamente', () => {
    cy.contains('h1', 'Inicia sesión').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain.text', 'Ingresar')
  })

  it('debería mostrar validaciones con campos vacíos', () => {
    cy.get('button[type="submit"]').click()
    cy.contains('El correo es obligatorio').should('be.visible')
  })
})
```

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 75%;
  }
</style>

# Test 2: Login Exitoso

```typescript
it('debería autenticarse con credenciales válidas', () => {
  cy.visit('/login')

  cy.get('input[type="email"]').type('admin@test.com')
  cy.get('input[type="password"]').type('secret123')
  cy.get('button[type="submit"]').click()

  // Verificar redirección
  cy.url().should('include', '/incidentes')
  cy.contains('Incidentes').should('be.visible')
})
```

**Concepto clave**: Cypress espera automáticamente a que los elementos estén listos.

---

<!-- backgroundColor: #232126 -->

<style scoped>
  h1 strong {
    color: #fbfbfb;
  }
  p {
    color: #fff;
  }
</style>

# **Parte 3**

Interceptando Requests HTTP

---

<!-- backgroundColor: #f6f7f9 -->

# ¿Por qué interceptar?

**`cy.intercept()`** te permite:

1. **Espiar** requests para validar que se llamen correctamente
2. **Esperar** a que las llamadas terminen antes de continuar
3. **Stubear** (simular) respuestas para probar casos edge

**Uso crítico**: Evitar fallos por timing (race conditions).

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 70%;
  }
</style>

# Test 3: Listado de Incidentes

```typescript
describe('Incidents List', () => {
  beforeEach(() => {
    // Interceptar la llamada al backend
    cy.intercept('GET', '**/api/incidents').as('getIncidents')

    cy.login() // Custom command para login

    // Esperar a que carguen los datos
    cy.wait('@getIncidents')
      .its('response.statusCode')
      .should('be.oneOf', [200, 304])
  })

  it('debería mostrar la tabla', () => {
    cy.get('table').should('be.visible')
    cy.get('table tbody tr').should('have.length.at.least', 1)
  })
})
```

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 75%;
  }
</style>

# Validar Códigos HTTP

```typescript
cy.wait('@getIncidents')
  .its('response.statusCode')
  .should('be.oneOf', [200, 304])
```

**¿Por qué 200 y 304?**

- **200 OK**: Respuesta fresca del servidor
- **304 Not Modified**: El backend tiene caché activado
  (nuestro `cacheMiddleware` con TTL de 30s)

**Consejo**: Siempre maneja ambos en tests E2E reales.

---

<!-- backgroundColor: #232126 -->

<style scoped>
  h1 strong {
    color: #fbfbfb;
  }
  p {
    color: #fff;
  }
</style>

# **Parte 4**

Comandos Personalizados

---

<!-- backgroundColor: #f6f7f9 -->

# El Problema: Código Duplicado

**Sin custom commands**:

```typescript
// En CADA test que necesite login:
cy.visit('/login')
cy.get('input[type="email"]').type('admin@test.com')
cy.get('input[type="password"]').type('secret123')
cy.get('button[type="submit"]').click()
cy.url().should('include', '/incidentes')
```

❌ Repetitivo, difícil de mantener, lento.

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 65%;
  }
</style>

# Custom Command: cy.login()

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('login', (options = {}) => {
  const credentials = {
    email: options.email ?? 'admin@test.com',
    password: options.password ?? 'secret123',
  }

  cy.session(
    ['login', credentials.email],
    () => {
      cy.visit('/login')
      cy.get('input[type="email"]').type(credentials.email)
      cy.get('input[type="password"]').type(credentials.password, {
        log: false,
      })
      cy.get('button[type="submit"]').click()
      cy.url().should('include', '/incidentes')
    },
    { cacheAcrossSpecs: true }
  )

  cy.visit(options.redirectTo ?? '/incidentes')
})
```

---

<!-- backgroundColor: #f6f7f9 -->

# Usar el Custom Command

**Ahora en tus tests**:

```typescript
describe('Incidents List', () => {
  beforeEach(() => {
    cy.login() // ✅ Una sola línea
  })

  it('debería mostrar incidentes', () => {
    cy.get('table').should('be.visible')
  })
})

it('test como reporter', () => {
  cy.login({ email: 'reporter@test.com' }) // ✅ Sobrescribir
})
```

---

<!-- backgroundColor: #f6f7f9 -->

# cy.session() - Cache de Autenticación

**Sin `cy.session()`**: Login completo en cada test (lento ❌)

**Con `cy.session()`**: Cachea cookies/localStorage (rápido ✅)

```typescript
cy.session(
  ['login', email],
  () => {
    // Este bloque se ejecuta SOLO la primera vez
    cy.visit('/login')
    cy.get('input').type(email)
    // ...
  },
  { cacheAcrossSpecs: true }
)
```

**Resultado**: Tests 5-10x más rápidos.

---

<!-- backgroundColor: #232126 -->

<style scoped>
  h1 strong {
    color: #fbfbfb;
  }
  p {
    color: #fff;
  }
</style>

# **Parte 5**

Fixtures y Datos de Prueba

---

<!-- backgroundColor: #f6f7f9 -->

# ¿Qué son las Fixtures?

**Fixtures** son archivos JSON con datos de prueba reutilizables.

**Ventajas**:

- ✅ Centralizan datos
- ✅ Facilitan mantenimiento
- ✅ Permiten reutilización entre specs

```
cypress/
  fixtures/
    users.json       ← Credenciales de prueba
    incidents.json   ← Datos de formularios
```

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 75%;
  }
</style>

# Fixtures: users.json

```json
{
  "admin": {
    "email": "carlos.lopez@example.com",
    "password": "secret123",
    "role": "admin"
  },
  "reporter": {
    "email": "luis.paredes@example.com",
    "password": "secret123",
    "role": "reporter"
  }
}
```

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 70%;
  }
</style>

# Usar Fixtures en Tests

```typescript
describe('Login', () => {
  let users

  before(() => {
    cy.fixture('users').then((data) => {
      users = data // Cargar fixture
    })
  })

  it('debería autenticar admin', () => {
    cy.get('input[type="email"]').type(users.admin.email)
    cy.get('input[type="password"]').type(users.admin.password)
    cy.get('button').click()
  })
})
```

**Cambio de credenciales**: Solo editas `users.json`, no cada test.

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 70%;
  }
</style>

# Fixtures: incidents.json

```json
{
  "newIncident": {
    "title": "Incidente de prueba E2E",
    "description": "Generado por Cypress",
    "severity": "high"
  },
  "criticalIncident": {
    "title": "Sistema caído en producción",
    "description": "Usuarios no pueden acceder",
    "severity": "critical"
  }
}
```

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 65%;
  }
</style>

# Test 4: Crear Incidente con Fixture

```typescript
describe('Incident Creation', () => {
  let incidents

  before(() => {
    cy.fixture('incidents').then((data) => {
      incidents = data
    })
  })

  it('debería crear un incidente', () => {
    cy.login()
    cy.contains('button', 'Nuevo incidente').click()

    const title = `${incidents.newIncident.title} ${Date.now()}`
    cy.get('input[formcontrolname="title"]').type(title)
    cy.get('textarea[formcontrolname="description"]').type(
      incidents.newIncident.description
    )

    cy.contains('button', 'Guardar').click()
    cy.contains('td', title).should('be.visible')
  })
})
```

---

<!-- backgroundColor: #232126 -->

<style scoped>
  h1 strong {
    color: #fbfbfb;
  }
  p {
    color: #fff;
  }
</style>

# **Parte 6**

Ejecutando Tests

---

<!-- backgroundColor: #f6f7f9 -->

# Dos Modos de Ejecución

## 1️⃣ Modo Interactivo (`cy:open`)

```bash
npm run cy:open
```

✅ Para desarrollo: Debugging visual, time-travel, ver cada paso

## 2️⃣ Modo Headless (`cy:run`)

```bash
npm run cy:run
```

✅ Para CI/CD: Rápido, screenshots automáticos, reportes

---

<!-- backgroundColor: #f6f7f9 -->

# Pre-requisitos para Ejecutar

**Antes de `npm run cy:open`**:

1. ✅ Levanta el backend: `cd incident-desk-api && npm run dev`
2. ✅ Ejecuta el seed: `npm run seed` (datos de prueba)
3. ✅ Levanta el frontend: `cd incident-desk-ui && npm start`

**Importante**: Backend en puerto `8080`, Frontend en `4200`.

---

<!-- backgroundColor: #f6f7f9 -->

# Demo: Cypress Test Runner

**Interfaz visual** que muestra:

- 📋 Lista de todos los specs
- ▶️ Ejecución en vivo de cada comando
- 🔍 Inspección del DOM en cada paso
- ⏰ Time-travel: Hover sobre comandos para ver screenshots
- 📸 Screenshots y videos de fallos

---

<!-- backgroundColor: #232126 -->

<style scoped>
  h1 strong {
    color: #fbfbfb;
  }
  p {
    color: #fff;
  }
</style>

# **Parte 7**

Buenas Prácticas

---

<!-- backgroundColor: #f6f7f9 -->

# 1. Usar Selectores Estables

❌ **Malo**: Selectores frágiles

```typescript
cy.get('.mat-button-primary').click() // Cambia con CSS
cy.contains('Guardar').click() // Cambia con i18n
```

✅ **Bueno**: Atributos específicos

```typescript
cy.get('[data-cy="save-button"]').click()
cy.get('button[type="submit"]').click()
cy.get('[formcontrolname="title"]').type('...')
```

---

<!-- backgroundColor: #f6f7f9 -->

# 2. No Hardcodear Esperas

❌ **Malo**: Tiempos arbitrarios

```typescript
cy.wait(3000) // ¿Por qué 3 segundos?
cy.get('table').should('be.visible')
```

✅ **Bueno**: Esperar eventos específicos

```typescript
cy.wait('@getIncidents') // Espera el request
cy.get('table').should('be.visible')
```

Cypress ya tiene **auto-waiting** integrado.

---

<!-- backgroundColor: #f6f7f9 -->

# 3. Organizar por Features

```
cypress/
  e2e/
    auth/
      01-login.cy.ts
      02-logout.cy.ts
    incidents/
      01-list.cy.ts
      02-create.cy.ts
      03-edit.cy.ts
    users/
      01-list.cy.ts
```

**Beneficio**: Fácil navegar, ejecutar subconjuntos, mantener.

---

<!-- backgroundColor: #f6f7f9 -->

# 4. Limpiar Estado entre Tests

**Problema**: Tests que dependen del orden fallan.

**Solución**: Cada test debe ser **independiente**.

```typescript
beforeEach(() => {
  // Opción 1: Reset de base de datos (solo en test env)
  cy.request('POST', '/api/test/reset')

  // Opción 2: Crear datos específicos para este test
  cy.task('seedTestData')

  // Opción 3: Usar fixtures consistentes
})
```
