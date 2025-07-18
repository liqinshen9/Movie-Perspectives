/// <reference types="cypress" />

describe('Auth flow', () => {
  const username = `testuser_${Date.now()}`
  const password = 'Password123!'

  it('registers then logs in via the UI', () => {
    // 1) Register via your /api/auth/register endpoint
    cy.request('POST', '/api/auth/register', { username, password })
      .its('status').should('eq', 200)

    // 2) Visit the real login page
    cy.visit('/login')

    // 3) Drive the real form (placeholders, exactly as in your Login.tsx)
    cy.get('input[placeholder="Username"]').type(username)
    cy.get('input[placeholder="Password"]').type(password)
    cy.contains('button', 'Login').click()

    // 4) Should land back on home
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
    cy.contains(/most popular movies/i)  // matches your Home title
  })
})
