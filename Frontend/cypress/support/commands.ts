/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(): Chainable<void>
  }
}

Cypress.Commands.add('login', () => {
  const username = `testuser_${Date.now()}`
  const password = 'Password123!'
  cy.request('POST', '/api/auth/register', {
    username,
    password,
  }).its('status').should('eq', 200)
  cy.request('POST', '/api/auth/login', {
    username,
    password,
  }).its('status').should('eq', 200)
  cy.visit('/')
})

/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    
    uiLogin(username: string, password: string): Chainable<void>
  }
}

Cypress.Commands.add('uiLogin', (username, password) => {
  cy.visit('/login')
  cy.get('input[placeholder="Username"]').type(username)
  cy.get('input[placeholder="Password"]').type(password)
  cy.contains('button', 'Login').click()
})

