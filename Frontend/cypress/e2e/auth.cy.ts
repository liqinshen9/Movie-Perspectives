/// <reference types="cypress" />

describe('Auth flow', () => {
  const username = `testuser_${Date.now()}`
  const password = 'Password123!'

  it('registers then logs in via the UI', () => {
    cy.request('POST', '/api/auth/register', { username, password })
      .its('status').should('eq', 200)

    cy.visit('/login')
    cy.get('input[placeholder="Username"]').type(username)
    cy.get('input[placeholder="Password"]').type(password)
    cy.contains('button', 'Login').click()

    cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
    cy.contains(/most popular movies/i)  
  })
})
