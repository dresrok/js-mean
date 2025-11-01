import 'dotenv/config';
import { Types } from 'mongoose';

import { connectToDatabase } from './database';
import { IncidentModel } from '../domains/incidents/incident.model';
import { seedReferenceSequence } from '../domains/incidents/incident-reference.util';
import { UserModel } from '../domains/users/user.model';

async function run() {
  // Prepara la conexión para poder sembrar los documentos iniciales.
  await connectToDatabase();

  // Limpia las colecciones para evitar duplicados durante la siembra.
  await UserModel.deleteMany({});
  await IncidentModel.deleteMany({});

  // Inserta usuarios de ejemplo que servirán como reporteros.
  const reporters = await UserModel.insertMany([
    {
      _id: new Types.ObjectId(),
      fullName: 'María Fernández',
      email: 'maria.fernandez@example.com',
      password: 'changeme',
      role: 'reporter',
      isActive: false,
    },
    {
      _id: new Types.ObjectId(),
      fullName: 'Luis Paredes',
      email: 'luis.paredes@example.com',
      password: 'changeme',
      role: 'reporter',
      isActive: true,
    },
  ]);

  // Inserta usuarios de ejemplo para el rol de agente.
  const agents = await UserModel.insertMany([
    {
      _id: new Types.ObjectId(),
      fullName: 'Ana Robles',
      email: 'ana.robles@example.com',
      password: 'changeme',
      role: 'agent',
      isActive: true,
    },
    {
      _id: new Types.ObjectId(),
      fullName: 'Diego Salas',
      email: 'diego.salas@example.com',
      password: 'changeme',
      role: 'agent',
      isActive: true,
    },
  ]);

  // Reinicia la secuencia de referencias antes de crear incidentes.
  seedReferenceSequence();

  // Crea incidentes de demostración enlazados a los usuarios anteriores.
  await IncidentModel.insertMany([
    {
      title: 'Correo corporativo no responde',
      description: 'Los usuarios reportan errores 500 al abrir Outlook Web.',
      severity: 'high',
      status: 'new',
      reportedBy: reporters[0]._id,
      assignedTo: agents[0]._id,
      tags: ['correo', 'infraestructura'],
    },
    {
      title: 'Impresoras sin papel en oficina principal',
      description: 'Solicitan reabastecer y revisar alertas de mantenimiento.',
      severity: 'medium',
      status: 'ack',
      reportedBy: reporters[1]._id,
      assignedTo: agents[1]._id,
      tags: ['hardware'],
    },
    {
      title: 'Portal de intranet cae intermitentemente',
      description: 'Se observa latencia alta en horarios pico.',
      severity: 'critical',
      status: 'in_progress',
      reportedBy: reporters[0]._id,
      assignedTo: agents[0]._id,
      tags: ['web', 'servicios'],
    },
    {
      title: 'Solicitud de alta de usuario en CRM',
      description: 'Nuevo integrante del equipo de ventas requiere acceso.',
      severity: 'low',
      status: 'resolved',
      reportedBy: reporters[1]._id,
      assignedTo: agents[1]._id,
      tags: ['crm'],
    },
    {
      title: 'Actualización de antivirus pendiente',
      description: 'Varios dispositivos muestran firma desactualizada.',
      severity: 'medium',
      status: 'new',
      reportedBy: reporters[0]._id,
      assignedTo: agents[1]._id,
      tags: ['seguridad'],
    },
  ]);

  console.log('[seed] Seed completado con usuarios e incidentes de ejemplo');
  process.exit(0);
}

run().catch((err) => {
  // Ante cualquier fallo mostramos el error y salimos con código distinto de cero.
  console.error('[seed] Error durante el seed', err);
  process.exit(1);
});
