/// <reference types="cypress" />

describe('Header search & reset', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('.nav-search select').select('title')
    cy.get('.nav-search input').clear()
  })

  it('shows 6 movies by default', () => {
    cy.get('.movie-card').should('have.length', 6)
  })

  it('filters by title and narrows the list', () => {
    cy.get('.nav-search input').type('Shining')
    cy.get('.movie-card')
      .its('length')
      .should('be.lt', 6)
  })

  it('filters by country and shows at least one result', () => {
    cy.get('.nav-search select').select('country')
    cy.get('.nav-search input').type('Japan')

    cy.get('.movie-card')
      .its('length')
      .should('be.gt', 0)     
      .and('be.lte', 12)      
  })

  it('resets search when Home is clicked', () => {
    cy.get('.nav-search select').select('country')
    cy.get('.nav-search input').type('Japan')

    cy.contains('nav .nav-link', 'Home').click()

    cy.get('.nav-search select').should('have.value', 'title')
    cy.get('.nav-search input').should('have.value', '')
    cy.get('.movie-card').should('have.length', 6)
  })
})
