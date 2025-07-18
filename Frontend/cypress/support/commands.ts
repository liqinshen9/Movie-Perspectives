/// <reference types="cypress" />

// 1. Tell TypeScript that Cypress.Chainable now has a loginAsTestUser method
declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Registers a fresh test user, logs in, and yields the username string.
     */
    loginAsTestUser(): Chainable<string>;
  }
}

// 2. Implement the command
Cypress.Commands.add(
  'loginAsTestUser',
  (): Cypress.Chainable<string> => {
    const username = `dtuser_${Date.now()}`;
    const password = 'Password123!';

    // Register then login
    cy.request('POST', '/api/auth/register', { username, password });
    cy.request('POST', '/api/auth/login',    { username, password });

    // Return the generated username so specs can use it
    return cy.wrap(username);
  }
);
