import { Router } from 'express';

import { users } from '../data/users';

// Crea el router para las rutas de los usuarios
const router = Router();

// Agrega la ruta para obtener todos los usuarios
router.get('/', (_req, res) => {
  // Devuelve todos los usuarios
  res.status(200).json(users);
});

// Exporta el router
export default router;
