import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/user.model';
import { connectDB } from './config/db';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Limpiar datos existentes
    await User.deleteMany();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // Crear usuario
    await User.create({
      name: 'Usuario Normal',
      email: 'user@test.com',
      password: hashedPassword,
      role: 'user',
    });

    console.log('Datos Importados Correctamente!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();

    console.log('Datos Destruidos!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
