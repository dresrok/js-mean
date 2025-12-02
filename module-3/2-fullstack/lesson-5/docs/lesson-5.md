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

# **Clase 5**

Optimización de consultas en MongoDB

---

<!-- backgroundColor: #f6f7f9 -->

# ¿Qué haremos hoy?

- Entender cómo MongoDB ejecuta queries y el problema del Collection Scan.
- Implementar índices estratégicos para acelerar consultas.
- Optimizar consultas con Aggregation Pipeline.
- Aplicar patrones de caché para reducir carga en la base de datos.

---

<!-- backgroundColor: #f6f7f9 -->

# El Problema: Queries Lentas

**Sin optimización** (estado actual):

- `find({ reportedBy: userId })` → Escanea **TODOS** los documentos
- `sort({ createdAt: -1 })` → Ordena en memoria
- `.populate()` → N+1 queries adicionales
- Sin caché → Consultas repetidas a MongoDB

---

<!-- backgroundColor: #f6f7f9 -->

# La Solución: Tres Pilares

## 1️⃣ Índices Estratégicos

Acelerar búsquedas y ordenamiento

## 2️⃣ Aggregation Pipeline

Optimizar joins y transformaciones

## 3️⃣ Cache

Evitar consultas repetidas

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

Índices en MongoDB

---

<!-- backgroundColor: #f6f7f9 -->

# ¿Qué es un Índice?

Un **índice** es una estructura de datos (B-tree) que MongoDB mantiene aparte de la colección principal.

**Analogía**: Como el índice de un libro 📚

- Sin índice → lees todo el libro página por página
- Con índice → vas directo a la página que necesitas

---

<!-- backgroundColor: #f6f7f9 -->

# Collection Scan vs Index Scan

**Sin índice (Collection Scan)**:

MongoDB examina TODOS los documentos uno por uno

**Con índice (Index Scan)**:

MongoDB usa el índice para saltar directo a los relevantes


---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  table {
    font-size: 85%;
  }
</style>

# Trade-offs de Índices

| Ventaja ✅                        | Desventaja ❌                             |
| --------------------------------- | ----------------------------------------- |
| Lecturas ultra rápidas            | Escrituras más lentas (actualizar índice) |
| Filtrado y ordenamiento eficiente | Uso adicional de disco y RAM              |
| Queries complejas ejecutables     | Mantener índices requiere overhead        |

**Regla de oro**: Indexa campos que usas frecuentemente en `find()`, `sort()` y filtros.

---

<!-- backgroundColor: #f6f7f9 -->

# Tipos de Índices

**1. Single Field Index** <small>Acelera búsquedas por un solo campo.</small>

```typescript
{
  status: 1
} // 1 = ascendente -> Acelera búsquedas por un solo campo.
```

**2. Compound Index** <small>Múltiples campos. Orden importa para optimización.</small>

```typescript
{ status: 1, createdAt: -1 }  // -1 = descendente
```

---

<!-- backgroundColor: #f6f7f9 -->

**3. Unique Index**

```typescript
{
  email: 1
} // con unique: true
```

Previene duplicados. MongoDB lo crea automáticamente.

**4. Text Index**

```typescript
{ title: 'text', description: 'text' }
```

Para búsquedas full-text tipo Google.

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 75%;
  }
</style>

# Implementación: Índices en Incident Model

```typescript
// ÍNDICE 1: Reporters viendo sus propios incidentes
incidentSchema.index({ reportedBy: 1, createdAt: -1 })

// ÍNDICE 2: Agents viendo incidentes asignados
incidentSchema.index({ assignedTo: 1, createdAt: -1 })

// ÍNDICE 3: Filtros por estado
incidentSchema.index({ status: 1, createdAt: -1 })

// ÍNDICE 4: Multi-filtro (estado + asignado)
incidentSchema.index({ status: 1, assignedTo: 1, createdAt: -1 })

// ÍNDICE 5: Optimizar generación de referencias
incidentSchema.index({ reference: -1 })
```

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 85%;
  }
</style>

# Implementación: Índice Text Search

```typescript
// ÍNDICE 6: Full-text search
incidentSchema.index(
  { title: 'text', description: 'text' },
  {
    weights: { title: 2, description: 1 }, // título 2x más relevante
    name: 'incident_text_search',
  }
)
```

**Uso**:

```typescript
// Buscar "error de conexión" en título y descripción
IncidentModel.find({
  $text: { $search: 'error conexión' },
})
```

---

<!-- backgroundColor: #f6f7f9 -->

# Implementación: Índices en User Model

```typescript
// Para obtener lista de agents activos
userSchema.index({ role: 1, isActive: 1 })
```

**Uso típico**:

```typescript
// Obtener todos los agents activos para un select/dropdown
UserModel.find({ role: 'agent', isActive: true })
```

Crítico para UI cuando se selecciona agente al crear/actualizar incidente.

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

Aggregation Pipeline

---

<!-- backgroundColor: #f6f7f9 -->

# El Problema con Populate


```typescript
IncidentModel.find(query)
  .populate('reportedBy', { fullName: 1 })
  .populate('assignedTo', { fullName: 1 })
```

**Problema (N+1 queries)**:

1. Query principal: obtener incidentes → 1 query
2. Para cada incidente, buscar `reportedBy` → N queries
3. Para cada incidente, buscar `assignedTo` → N queries

**Total**: 1 + 2N queries 😱

---

<!-- backgroundColor: #f6f7f9 -->

# ¿Qué es Aggregation Pipeline?

Una **pipeline de agregación** es una serie de etapas que transforman documentos. **Ventaja clave**: Todo sucede en **una sola query** a MongoDB.

- `$match` → Filtrar documentos
- `$sort` → Ordenar
- `$lookup` → JOIN con otra colección
- `$project` → Seleccionar campos
- `$addFields` → Transformar datos

---

<!-- backgroundColor: #f6f7f9 -->

# Populate vs Aggregation

| Aspecto            | Populate (actual) | Aggregation (optimizado) |
| ------------------ | ----------------- | ------------------------ |
| Número de queries  | 1 + 2N            | 1                        |
| Performance        | Decente           | Excelente                |
| Complejidad código | Simple            | Moderada                 |
| Flexibilidad       | Limitada          | Muy alta                 |

**Recomendación**: Mantener populate para simplicidad. Migrar a aggregation cuando el volumen crece (>100k documentos).

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

Cache

---

<!-- backgroundColor: #f6f7f9 -->

# ¿Qué es un Caché?

Un **caché** es una capa de almacenamiento temporal en memoria que guarda resultados de operaciones costosas.

**Objetivo**: Evitar consultas repetidas a la base de datos.

**Ejemplo**:

1. Usuario solicita `/incidents` → Query a MongoDB
2. Usuario recarga página → **Caché** →
3. Alguien crea incidente → **Invalidar caché**
4. Próxima request → Query a MongoDB

---

<!-- backgroundColor: #f6f7f9 -->

# Configuración del Caché

```typescript
const responseCache = new LRUCache({
  max: 100, // Máximo 100 entradas
  ttl: 30000, // 30 segundos de vida
  updateAgeOnGet: false, // No renovar TTL al acceder
})
```

**Por qué 30 segundos?**

- Balance entre frescura y performance
- Evita datos muy desactualizados
- Reduce carga significativamente en endpoints populares

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 70%;
  }
</style>

# Implementación: Cache Middleware

```typescript
export function cacheMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.method !== 'GET') {
    return next() // Solo cachear GETs
  }
  const cacheKey = req.originalUrl // URL completa como clave
  const cachedResponse = responseCache.get(cacheKey)

  if (cachedResponse) {
    return res.json(cachedResponse) // Cache HIT ✅
  }
  // Cache MISS ❌ → Interceptar respuesta para guardarla
  const originalJson = res.json.bind(res)
  res.json = function (body) {
    responseCache.set(cacheKey, body)
    return originalJson(body)
  }
  next()
}
```

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 80%;
  }
</style>

# Aplicar Caché en Routes

```typescript
import { cacheMiddleware } from '../../core/cache.middleware';

// Incidents
incidentsRouter.get('/', cacheMiddleware, listIncidents); ✅
incidentsRouter.get('/:id', cacheMiddleware, getIncident); ✅

// Users
usersRouter.get('/', authorize(...), cacheMiddleware, listUsers); ✅
```

**Importante**: Solo cachear GET requests, nunca POST/PUT/DELETE.

---

<!-- backgroundColor: #f6f7f9 -->

<style scoped>
  pre {
    font-size: 75%;
  }
</style>

# Invalidación de Caché

```typescript
export async function createIncident(...) {
  const incident = await incidentService.createIncident(data);
  invalidateCache(); // Limpiar caché ✅
}

export async function updateIncident(...) {
  const updated = await incidentService.updateIncident(id, data);
  invalidateCache(); // Limpiar caché ✅
}
```

**Por qué invalidar todo el caché?**
- Simplicidad: Un cambio puede afectar múltiples vistas
- Seguridad: Garantiza datos frescos después de mutaciones
