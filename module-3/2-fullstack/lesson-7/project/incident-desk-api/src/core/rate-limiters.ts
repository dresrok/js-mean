import rateLimit from 'express-rate-limit';

const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;

// Función auxiliar para parsear números de variables de entorno
function parseNumber(envValue: string | undefined, fallback: number): number {
  const parsed = Number(envValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

// Ventana de tiempo y límite de intentos para login
const loginWindowMs = parseNumber(process.env.LOGIN_RATE_WINDOW_MS, FIFTEEN_MINUTES_IN_MS);
const loginLimit = parseNumber(process.env.LOGIN_RATE_MAX, 5);

// Limitador para login
export const loginRateLimiter = rateLimit({
  windowMs: loginWindowMs,
  limit: loginLimit,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts, please try again later.',
    code: 'RATE_LIMITED',
  },
});
