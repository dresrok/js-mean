import { slowCypressDown } from 'cypress-slow-down';

slowCypressDown(200);

const INCIDENTS_ENDPOINT = '**/api/incidents';

describe('Incidents List', () => {
  beforeEach(() => {
    cy.intercept('GET', INCIDENTS_ENDPOINT).as('getIncidents');
    cy.login();
    cy.wait('@getIncidents').its('response.statusCode').should('be.oneOf', [200, 304]);
  });

  it('debería mostrar la tabla de incidentes', () => {
    cy.get('table').should('be.visible');
    cy.get('table tbody tr').should('have.length.at.least', 1);
  });

  it('debería mostrar las columnas esperadas', () => {
    const headers = ['Código', 'Título', 'Estado', 'Severidad', 'Actualizado'];
    headers.forEach((header) => {
      cy.contains('th', header).should('be.visible');
    });
  });

  it('debería mostrar el botón para crear un incidente', () => {
    cy.contains('button', 'Nuevo incidente').should('be.visible');
  });
});
