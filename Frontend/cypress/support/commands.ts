/// <reference types="cypress" />


declare namespace Cypress {
  interface Chainable<Subject = any> {
  
    loginAsTestUser(): Chainable<string>;
  }
}


Cypress.Commands.add(
  'loginAsTestUser',
  (): Cypress.Chainable<string> => {
    const username = `dtuser_${Date.now()}`;
    const password = 'Password123!';

  
    cy.request('POST', '/api/auth/register', { username, password });
    cy.request('POST', '/api/auth/login',    { username, password });


    return cy.wrap(username);
  }
);
