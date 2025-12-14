import express from 'express';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../controllers/goal.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Todas las rutas de metas están protegidas
router.use(protect);

router.route('/').get(getGoals).post(createGoal);
router.route('/:id').put(updateGoal).delete(deleteGoal);

export default router;
