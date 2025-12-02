import type { Request, Response, NextFunction } from 'express';
import { LRUCache } from 'lru-cache';

// ============================================================================
// PATRÓN DE CACHÉ - Clase 5: Optimización de Consultas
// ============================================================================

/**
 * Caché LRU (Least Recently Used) para almacenar respuestas de API.
 * 
 * Configuración:
 * - max: Número máximo de entradas en caché (100)
 * - ttl: Tiempo de vida de cada entrada (30 segundos = 30000ms)
 * - updateAgeOnGet: No actualiza el TTL al acceder (evita que items populares vivan indefinidamente)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const responseCache = new LRUCache<string, any>({
  max: 100,
  ttl: 30000, // 30 segundos
  updateAgeOnGet: false,
});

/**
 * Middleware de caché que intercepta requests GET y cachea las respuestas.
 * 
 * Funcionamiento:
 * 1. Para requests GET, genera una clave única basada en URL y query params
 * 2. Si existe en caché, devuelve la respuesta cacheada
 * 3. Si no existe, ejecuta la ruta original e intercepta la respuesta
 * 4. Guarda la respuesta en caché antes de enviarla al cliente
 * 
 * Uso:
 * ```typescript
 * router.get('/incidents', cacheMiddleware, getAllIncidentsController);
 * ```
 */
export function cacheMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Solo cachear requests GET
  if (req.method !== 'GET') {
    next();
    return;
  }

  // Generar clave única basada en URL completa (incluye query params)
  const cacheKey = req.originalUrl || req.url;

  // Intentar recuperar de caché
  const cachedResponse = responseCache.get(cacheKey);

  if (cachedResponse) {
    // Cache hit: devolver respuesta cacheada
    res.json(cachedResponse);
    return;
  }

  // Cache miss: interceptar res.json() para cachear la respuesta
  const originalJson = res.json.bind(res);

  res.json = function (body: unknown) {
    // Guardar en caché antes de enviar
    responseCache.set(cacheKey, body);

    // Enviar respuesta original
    return originalJson(body);
  };

  next();
}

/**
 * Invalida toda la caché.
 * Útil cuando se crean, actualizan o eliminan recursos que afectan múltiples endpoints.
 * 
 * Uso típico:
 * - Después de crear un incidente
 * - Después de actualizar un incidente
 * - Después de cancelar un incidente
 * 
 * Llamar desde el servicio o controlador:
 * ```typescript
 * await createIncident(input);
 * invalidateCache();
 * ```
 */
export function invalidateCache(): void {
  responseCache.clear();
}

/**
 * Invalida entradas de caché específicas que coincidan con un patrón.
 * Más granular que invalidateCache() pero requiere iterar la caché.
 * 
 * @param pattern - String o RegExp para matchear claves de caché
 * 
 * Ejemplo:
 * ```typescript
 * // Invalidar solo rutas de incidentes
 * invalidateCachePattern(/^\/incidents/);
 * ```
 */
export function invalidateCachePattern(pattern: string | RegExp): void {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

  for (const key of responseCache.keys()) {
    if (regex.test(key)) {
      responseCache.delete(key);
    }
  }
}

/**
 * Obtiene estadísticas de la caché para monitoreo.
 * Útil para debugging y optimización.
 * 
 * @returns Objeto con métricas de caché
 */
export function getCacheStats() {
  return {
    size: responseCache.size,
    maxSize: responseCache.max,
    calculatedSize: responseCache.calculatedSize,
  };
}

