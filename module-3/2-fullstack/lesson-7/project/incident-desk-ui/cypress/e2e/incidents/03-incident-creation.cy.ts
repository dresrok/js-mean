import { slowCypressDown } from 'cypress-slow-down';

slowCypressDown(200);

const INCIDENTS_ENDPOINT = '**/api/incidents';
const AGENTS_ENDPOINT = '**/api/users?role=agent';

type IncidentsFixture = {
  newIncident: {
    title: string;
    description: string;
    severity: string;
  };
  minimalIncident: {
    title: string;
    description: string;
    severity: string;
  };
  criticalIncident: {
    title: string;
    description: string;
    severity: string;
  };
};

describe('Incident Creation', () => {
  let incidents: IncidentsFixture;

  before(() => {
    cy.fixture('incidents').then((data) => {
      incidents = data;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', INCIDENTS_ENDPOINT).as('getIncidents');
    cy.login();
    cy.wait('@getIncidents').its('response.statusCode').should('be.oneOf', [200, 304]);
  });

  it('debería permitir crear un nuevo incidente', () => {
    // Agregar timestamp para hacer el título único en cada ejecución
    const incidentTitle = `${incidents.newIncident.title} ${Date.now()}`;

    cy.intercept('GET', AGENTS_ENDPOINT).as('getAgents');
    cy.contains('button', 'Nuevo incidente').click();
    cy.wait('@getAgents').its('response.statusCode').should('be.oneOf', [200, 304]);
    cy.url().should('include', '/incidentes/nuevo');

    cy.intercept('POST', INCIDENTS_ENDPOINT).as('createIncident');

    cy.get('input[formcontrolname="title"]').type(incidentTitle);
    cy.get('textarea[formcontrolname="description"]').type(incidents.newIncident.description);

    cy.get('mat-select[formcontrolname="severity"]').click();
    cy.get('mat-option').contains('Alta').click();

    cy.contains('button', 'Guardar').click();

    cy.wait('@createIncident').its('response.statusCode').should('be.oneOf', [200, 201]);
    cy.url().should('match', /\/incidentes$/);
    cy.contains('td', incidentTitle, { timeout: 10000 }).should('be.visible');
  });

  it('debería validar campos obligatorios', () => {
    cy.contains('button', 'Nuevo incidente').click();
    cy.url().should('include', '/incidentes/nuevo');

    cy.contains('button', 'Guardar').click();

    cy.contains('El título es obligatorio').should('be.visible');
    cy.contains('La descripción es obligatoria').should('be.visible');
    cy.url().should('include', '/incidentes/nuevo');
  });
});
