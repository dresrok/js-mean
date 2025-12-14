import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import goalRoutes from './routes/goal.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.send('API Gestor de Metas está funcionando');
});

// Routes
app.use('/api/auth', authRoutes);
// Añadir rutas de metas /api/metas

// Database Connection & Server Start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});
