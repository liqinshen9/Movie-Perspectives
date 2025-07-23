import './commands';

Cypress.on('run:end', () => {

  cy.request('POST', '/api/testing/cleanup-test-reviews')
    .its('body.deleted')
    .should('be.gte', 0);
});
