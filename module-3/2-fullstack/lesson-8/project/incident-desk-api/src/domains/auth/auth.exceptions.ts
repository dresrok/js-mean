/**
 * Error lanzado cuando las credenciales de autenticación son inválidas.
 * Abarca casos como email inexistente, contraseña incorrecta o cuenta inactiva.
 */
export class InvalidCredentialsError extends Error {
  constructor(message: string = 'Invalid email or password') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

/**
 * Error lanzado cuando un token JWT es inválido, malformado o no puede ser verificado.
 */
export class InvalidTokenError extends Error {
  constructor(message: string = 'Invalid authentication token') {
    super(message);
    this.name = 'InvalidTokenError';
  }
}

