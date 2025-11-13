import { UserModel, toUserRecord } from './user.model';

// Parámetros opcionales para filtrar la lista de usuarios.
type ListUsersParams = {
  role?: string;
};

// Aplica filtros simples sobre la colección de usuarios antes de retornar.
export async function listUsers({ role }: ListUsersParams) {
  const filters: Record<string, unknown> = {};

  if (role) {
    filters.role = role;
  }

  const users = await UserModel.find(filters)
    .sort({ fullName: 1 })
    .lean()
    .exec();

  // Se expone el modelo sin credenciales gracias al helper reutilizable.
  return users.map(toUserRecord);
}
