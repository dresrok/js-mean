import { slowCypressDown } from 'cypress-slow-down';

slowCypressDown(200);

type UsersFixture = {
  admin: {
    email: string;
    password: string;
    fullName: string;
  };
  agent: {
    email: string;
    password: string;
    fullName: string;
  };
  reporter: {
    email: string;
    password: string;
    fullName: string;
  };
};

describe('Login Page', () => {
  let users: UsersFixture;

  before(() => {
    cy.fixture('users').then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.visit('/login');
  });

  it('debería cargar la pantalla con los campos principales', () => {
    cy.contains('h1', 'Inicia sesión').should('be.visible');
    cy.contains('p', 'Accede al tablero').should('be.visible');
    cy.get('input[matInput][type="email"]').should('be.visible');
    cy.get('input[matInput][type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain.text', 'Ingresar');
  });

  it('debería mostrar validaciones si se envía vacío', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('El correo es obligatorio').should('be.visible');
    cy.contains('La contraseña es obligatoria').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('debería mostrar error con credenciales inválidas', () => {
    cy.get('input[matInput][type="email"]').type('usuario@invalido.com', { force: true });
    cy.get('input[matInput][type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains('Revisa tus credenciales e inténtalo de nuevo', { timeout: 5000 }).should(
      'be.visible'
    );
    cy.url().should('include', '/login');
  });

  it('debería autenticarse con credenciales válidas', () => {
    cy.get('input[matInput][type="email"]').type(users.admin.email, { force: true });
    cy.get('input[matInput][type="password"]').type(users.admin.password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/incidentes');
    cy.contains('Incidentes').should('be.visible');
  });
});
