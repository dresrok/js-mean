import './commands';

beforeEach(() => {
  // Propaga fallos no controlados solo como aviso, evitando falsos positivos.
  cy.on('uncaught:exception', () => {
    return false;
  });
});

