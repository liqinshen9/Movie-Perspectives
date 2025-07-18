// cypress/support/e2e.ts
import './commands';

Cypress.on('run:end', () => {
  // Hit our DEBUG‑only cleanup endpoint
  cy.request('POST', '/api/testing/cleanup-test-reviews')
    .its('body.deleted')
    .should('be.gte', 0);
});
