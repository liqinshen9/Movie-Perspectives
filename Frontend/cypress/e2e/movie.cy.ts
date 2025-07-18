/// <reference types="cypress" />

describe('Movie browsing', () => {
  const username = `testuser_${Date.now()}`
  const password = 'Password123!'

  before(() => {
    // Register once
    cy.request('POST', '/api/auth/register', { username, password })
      .its('status').should('eq', 200)
  })

  beforeEach(() => {
    // Log in via the UI before each test
    cy.visit('/login')
    cy.get('input[placeholder="Username"]').type(username)
    cy.get('input[placeholder="Password"]').type(password)
    cy.contains('button', 'Login').click()
  })

  it('shows exactly 6 popular movies on home', () => {
    // your Home.tsx renders .movie-card DIVs
    cy.get('.movie-card').should('have.length', 6)
  })
})
