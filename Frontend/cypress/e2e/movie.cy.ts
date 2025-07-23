/// <reference types="cypress" />

describe('Movie browsing', () => {
  const username = `testuser_${Date.now()}`
  const password = 'Password123!'

  before(() => {
   
    cy.request('POST', '/api/auth/register', { username, password })
      .its('status').should('eq', 200)
  })

  beforeEach(() => {
   
    cy.visit('/login')
    cy.get('input[placeholder="Username"]').type(username)
    cy.get('input[placeholder="Password"]').type(password)
    cy.contains('button', 'Login').click()
  })

  it('shows exactly 6 popular movies on home', () => {
  
    cy.get('.movie-card').should('have.length', 6)
  })
})
