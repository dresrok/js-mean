import { Router } from 'express';

import { incidents } from '../data/incidents.js';

// Crea el router para las rutas de los incidentes
const router = Router();

// Agrega la ruta para obtener todos los incidentes
router.get('/', (_req, res) => {
  // Devuelve todos los incidentes
  res.status(200).json(incidents);
});

// Exporta el router
export default router;
