/// <reference types="cypress" />

describe('Profile page introduction editing', () => {
  const username = `pfuser_${Date.now()}`
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

    cy.visit(`/profile/${username}`)
  })

  it('adds an introduction and displays it', () => {
    cy.get('.profile-intro-section').within(() => {
      cy.contains('button', 'Add').click()
      cy.get('textarea[placeholder="Write your introduction…"]')
        .type('Hello, I love movies!')
      cy.contains('button', 'Save').click()
    
      cy.contains('Hello, I love movies!')
    })
  })

  it('edits an existing introduction', () => {
    cy.get('.profile-intro-section').within(() => {
      cy.contains('button', 'Edit').click()
      cy.get('textarea[placeholder="Write your introduction…"]')
        .clear()
        .type('Updated intro text')
      cy.contains('button', 'Save').click()
      cy.contains('Updated intro text')
    })
  })
})
