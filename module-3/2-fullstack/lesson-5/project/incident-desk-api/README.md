# Incident Desk API - Clase 5: Optimización de Consultas en MongoDB

Backend optimizado con índices estratégicos, agregación eficiente y sistema de caché LRU.

## 🚀 Cambios Implementados

### 1. Índices Estratégicos en MongoDB

#### Incident Model (`src/domains/incidents/incident.model.ts`)

Se añadieron **6 índices** para optimizar las consultas más frecuentes:

1. **`{ reportedBy: 1, createdAt: -1 }`**
   - Para reporters viendo sus propios incidentes
   - Optimiza: `find({ reportedBy: userId }).sort({ createdAt: -1 })`

2. **`{ assignedTo: 1, createdAt: -1 }`**
   - Para agents viendo incidentes asignados
   - Optimiza: `find({ assignedTo: agentId }).sort({ createdAt: -1 })`

3. **`{ status: 1, createdAt: -1 }`**
   - Para filtros por estado con ordenamiento
   - Optimiza: `find({ status: 'new' }).sort({ createdAt: -1 })`

4. **`{ status: 1, assignedTo: 1, createdAt: -1 }`**
   - Para queries multi-filtro (estado + asignación)
   - Optimiza: `find({ status: 'in_progress', assignedTo: agentId })`

5. **`{ reference: -1 }`**
   - Para el hook `ensureReference` que genera referencias secuenciales
   - Optimiza: `findOne().sort({ reference: -1 })`

6. **Índice de texto: `{ title: 'text', description: 'text' }`**
   - Para búsquedas full-text (opcional)
   - Permite: `find({ $text: { $search: "error conexión" } })`
   - Pesos: título (2x) > descripción (1x)

#### User Model (`src/domains/users/user.model.ts`)

Se añadió **1 índice** adicional:

- **`{ role: 1, isActive: 1 }`**
  - Para obtener listas de usuarios por rol (ej: agents activos)
  - Optimiza: `find({ role: 'agent', isActive: true })`

### 2. Optimización de Populate con Aggregation Pipeline

Se añadió `getAllIncidentsOptimized()` en `src/domains/incidents/incidents.service.ts`:

**Ventajas sobre populate tradicional:**
- Una sola query a MongoDB (vs 1 + N queries con populate)
- Mayor control sobre proyecciones
- Mejor performance con grandes volúmenes (>100k documentos)

**Pipeline de agregación:**
1. `$match`: Filtra por reportedBy/assignedTo
2. `$sort`: Ordena por createdAt (usa índice)
3. `$lookup`: JOIN con users para reportedBy
4. `$lookup`: JOIN con users para assignedTo
5. `$project`: Reestructura campos
6. `$addFields`: Convierte ObjectIds a strings

**Cuándo usar:**
- Mantener `getAllIncidents()` (con populate) para simplicidad
- Migrar a `getAllIncidentsOptimized()` cuando:
  - Volumen crece significativamente (>100k incidents)
  - Se necesitan joins más complejos
  - Se requieren facets o grouping

### 3. Sistema de Caché LRU

#### Cache Middleware (`src/core/cache.middleware.ts`)

Implementación de caché en memoria usando `lru-cache`:

**Configuración:**
- **max**: 100 entradas
- **ttl**: 30 segundos
- **updateAgeOnGet**: false (evita que items populares vivan indefinidamente)

**Funciones exportadas:**

1. **`cacheMiddleware`**: Middleware para Express
   - Solo cachea requests GET
   - Genera clave única basada en URL completa (incluye query params)
   - Intercepta `res.json()` para guardar respuesta antes de enviar

2. **`invalidateCache()`**: Limpia toda la caché
   - Llamar después de crear, actualizar, cancelar o eliminar incidentes

3. **`invalidateCachePattern(pattern)`**: Invalidación granular
   - Invalida solo rutas que matcheen un patrón (string o RegExp)

4. **`getCacheStats()`**: Métricas de caché
   - Útil para debugging y monitoreo

#### Integración

**Incidents Routes** (`src/domains/incidents/incidents.routes.ts`):
```typescript
import { cacheMiddleware } from '../../core/cache.middleware';

incidentsRouter.route('/')
  .get(cacheMiddleware, listIncidents)  // ✅ Cacheado
  .post(createIncident);                 // ❌ No cachear POSTs

incidentsRouter.route('/:id')
  .get(cacheMiddleware, getIncident)    // ✅ Cacheado
  .put(updateIncident)                   // ❌ No cachear PUTs
```

**Users Routes** (`src/domains/users/users.routes.ts`):
```typescript
import { cacheMiddleware } from '../../core/cache.middleware';

usersRouter.get('/', authorize(PERMISSIONS.USERS_READ_ALL), cacheMiddleware, listUsers); // ✅ Cacheado
```

**Incidents Controller** (`src/domains/incidents/incidents.controller.ts`):
- Importar `invalidateCache()` desde cache.middleware
- Llamar después de cada operación de mutación:
  - `createIncident()` ✅
  - `updateIncident()` ✅
  - `cancelIncident()` ✅
  - `deleteIncident()` ✅

**Users Controller** (`src/domains/users/users.controller.ts`):
- Importar `invalidateCache()` desde cache.middleware
- Llamar después de cada operación de mutación:
  - `createUser()` ✅

## 📊 Impacto en Rendimiento

### Sin Índices (Antes)
- `find({ reportedBy: userId })`: Collection scan → O(n)
- `sort({ createdAt: -1 })`: Sort en memoria
- Populate: 1 query inicial + N queries adicionales

### Con Índices (Después)
- `find({ reportedBy: userId })`: Index scan → O(log n)
- `sort({ createdAt: -1 })`: Usa índice (sin sort en memoria)
- Populate: Mismas queries pero optimizadas por índices

### Con Caché (30s TTL)
- Primera request: Normal (con índices)
- Requests siguientes (< 30s): Respuesta inmediata desde memoria
- Invalidación: Automática al crear/actualizar/cancelar/eliminar incidentes o crear usuarios

## 🛠️ Testing de Índices

### Verificar Índices Creados

Conectar a MongoDB y ejecutar:

```javascript
// En MongoDB shell o Compass
use incident_desk;

// Ver índices de incidentes
db.incidents.getIndexes();

// Ver índices de usuarios
db.users.getIndexes();
```

Deberías ver los índices creados automáticamente al iniciar la aplicación.

### Analizar Queries con explain()

```javascript
// Query sin índice (ejemplo)
db.incidents.find({ reportedBy: ObjectId("...") })
  .sort({ createdAt: -1 })
  .explain("executionStats");
```

**Verificar:**
- `executionStats.executionStages.stage`: Debe ser `"IXSCAN"` (index scan) no `"COLLSCAN"`
- `executionStats.totalDocsExamined`: Debe ser bajo (~= número de resultados)
- `executionStats.executionTimeMillis`: Debe ser < 50ms

### Testing de Caché

```bash
# Request 1 (cache miss)
curl http://localhost:3000/incidents \
  -H "Authorization: Bearer <token>" \
  -w "\nTime: %{time_total}s\n"

# Request 2 (cache hit, < 30s después)
curl http://localhost:3000/incidents \
  -H "Authorization: Bearer <token>" \
  -w "\nTime: %{time_total}s\n"

# Crear incidente (invalida caché)
curl -X POST http://localhost:3000/incidents \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test cache invalidation", ...}'

# Request 3 (cache miss, caché invalidada)
curl http://localhost:3000/incidents \
  -H "Authorization: Bearer <token>" \
  -w "\nTime: %{time_total}s\n"
```

**Resultados esperados:**
- Request 1: ~50-100ms (sin caché, con índices)
- Request 2: ~5-10ms (desde caché)
- Request 3: ~50-100ms (caché invalidada)

## 📝 Dependencias Añadidas

```json
{
  "dependencies": {
    "lru-cache": "^11.0.2"
  }
}
```

Instalar con:
```bash
npm install lru-cache
```

## 🎯 Próximos Pasos (Opcional)

1. **Paginación**
   - Añadir límite y offset a `getAllIncidents()`
   - Usar cursor-based pagination para mejor performance

2. **Índices adicionales**
   - Índice por `tags` si se añade búsqueda por etiquetas
   - Índice por `severity` si se filtra por severidad

3. **Caché avanzado**
   - Implementar Redis para caché distribuido
   - TTL variable según tipo de recurso
   - Invalidación selectiva por ID de incidente

4. **Monitoreo**
   - Endpoint `/health/cache` con estadísticas
   - Logs de performance de queries
   - Alertas si queries superan threshold

## 📚 Recursos

- [MongoDB Indexing Strategies](https://www.mongodb.com/docs/manual/indexes/)
- [Aggregation Pipeline Optimization](https://www.mongodb.com/docs/manual/core/aggregation-pipeline-optimization/)
- [LRU Cache Package](https://github.com/isaacs/node-lru-cache)

---

**Clase 5 Completada** ✅
- ✅ Índices estratégicos en Incident y User models
- ✅ Función de agregación optimizada
- ✅ Sistema de caché LRU con invalidación automática
- ✅ Caché implementado en endpoints de incidents y users

