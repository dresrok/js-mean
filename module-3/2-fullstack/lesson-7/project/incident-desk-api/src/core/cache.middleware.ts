import type { Request, Response, NextFunction } from 'express';
import { LRUCache } from 'lru-cache';

// Caché LRU (Least Recently Used) para almacenar respuestas de API
const responseCache = new LRUCache<string, object>({
  max: 100,
  ttl: 30000, // 30 segundos
  updateAgeOnGet: false,
});

// Middleware de caché que intercepta requests GET y cachea las respuestas
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

  res.json = function (result: object) {
    // Guardar en caché antes de enviar
    responseCache.set(cacheKey, result);

    // Enviar respuesta original
    return originalJson(result);
  };

  next();
}

// Limpia toda la caché
export function invalidateCache(): void {
  responseCache.clear();
}


