/// <reference types="cypress" />

describe('Movie detail & review posting', () => {
  const username = `dtuser_${Date.now()}`
  const password = 'Password123!'

  before(() => {
   
    cy.visit('/register')
    cy.window().then(win => {
      cy.stub(win, 'alert').as('registerAlert')
    })
    cy.get('input[placeholder="Username"]').type(username)
    cy.get('input[placeholder="Password"]').type(password)
    cy.contains('button', 'Register').click()
    cy.get('@registerAlert')
      .should('have.been.calledWith', 'Registered! Please log in.')
  })

  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[placeholder="Username"]').type(username)
    cy.get('input[placeholder="Password"]').type(password)
    cy.contains('button', 'Login').click()
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
  })

  it('navigates to the first movie’s detail page', () => {
    cy.request('/api/movie')
      .its('body')
      .then((movies: any[]) => {
        const first = movies[0]

        cy.visit('/')                   
        cy.get('.movie-card').first().click()    
        cy.url().should('include', `/movies/${first.id}`)
        cy.contains('.title', first.title)
      })
  })

  it('can post a review and see it immediately', () => {
    cy.request('/api/movie')
      .its('body')
      .then((movies: any[]) => {
        const first = movies[0]

        cy.visit(`/movies/${first.id}`)

        cy.get('textarea[placeholder="Please leave a review"]')
          .should('exist')
          .type('E2E testing reviews')
        cy.contains('button', 'Submit').click()

        cy.contains('.review-text', 'E2E testing reviews')
      })
  })
})
