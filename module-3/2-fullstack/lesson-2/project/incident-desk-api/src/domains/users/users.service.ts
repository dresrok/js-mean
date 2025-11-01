import { UserModel } from './user.model';

type ListUsersParams = {
  role?: string;
};

// Aplica filtros simples sobre la colección de usuarios antes de retornar.
export async function listUsers({ role }: ListUsersParams) {
  const filters: Record<string, unknown> = {};

  if (role) {
    filters.role = role;
  }

  return UserModel.find(filters)
    .sort({ fullName: 1 })
    .lean()
    .exec();
}
