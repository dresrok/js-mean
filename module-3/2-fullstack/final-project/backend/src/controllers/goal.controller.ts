import { Request, Response } from 'express';

// @desc    Obtener metas
// @route   GET /api/metas
// @access  Private
export const getGoals = async (req: Request, res: Response) => {
  // TODO: Implementar lógica para obtener metas del usuario
  res.status(501).json({ message: 'Método no implementado' });
};

// @desc    Crear meta
// @route   POST /api/metas
// @access  Private
export const createGoal = async (req: Request, res: Response) => {
  // TODO: Implementar lógica para crear meta
  res.status(501).json({ message: 'Método no implementado' });
};

// @desc    Actualizar meta
// @route   PUT /api/metas/:id
// @access  Private
export const updateGoal = async (req: Request, res: Response) => {
  // TODO: Implementar lógica para actualizar meta
  res.status(501).json({ message: 'Método no implementado' });
};

// @desc    Eliminar meta
// @route   DELETE /api/metas/:id
// @access  Private
// Nota: Solo admin puede eliminar/cancelar según requerimientos, o el usuario propietario si es borrado lógico.
export const deleteGoal = async (req: Request, res: Response) => {
  // TODO: Implementar lógica para eliminar meta
  res.status(501).json({ message: 'Método no implementado' });
};
