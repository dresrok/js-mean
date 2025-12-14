type LoginOptions = {
  email?: string;
  password?: string;
  redirectTo?: string;
  skipRedirect?: boolean;
};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Inicia sesión utilizando el formulario de la aplicación.
       * Si no se proveen credenciales usa el administrador sembrado.
       */
      login(options?: LoginOptions): Chainable<void>;
    }
  }
}

const DEFAULT_ADMIN = {
  email: 'carlos.lopez@example.com',
  password: 'secret123',
};

Cypress.Commands.add('login', (options: LoginOptions = {}) => {
  const adminFromEnv = Cypress.env('adminUser') ?? {};
  const credentials = {
    email: options.email ?? adminFromEnv.email ?? DEFAULT_ADMIN.email,
    password: options.password ?? adminFromEnv.password ?? DEFAULT_ADMIN.password,
  };

  const destination = options.redirectTo ?? '/incidentes';

  cy.session(
    ['login', credentials.email, destination],
    () => {
      cy.visit('/login');
      cy.get('input[matInput][type="email"]').clear({ force: true }).type(credentials.email, { force: true });
      cy.get('input[matInput][type="password"').clear().type(credentials.password, { log: false });
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/incidentes');
    },
    { cacheAcrossSpecs: true }
  );

  if (!options.skipRedirect) {
    cy.visit(destination);
  }
});

export { };

