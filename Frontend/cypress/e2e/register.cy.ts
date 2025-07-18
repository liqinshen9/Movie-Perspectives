
describe('Registration flow', () => {
  const username = `reguser_${Date.now()}`
  const password = 'Password123!'

  it('registers a new user and redirects to login', () => {
    cy.visit('/register')
    cy.get('input[placeholder="Username"]').type(username)
    cy.get('input[placeholder="Password"]').type(password)


    cy.window().then(win => {
      cy.stub(win, 'alert').as('alert')
    })

    cy.contains('button', 'Register').click()
    cy.get('@alert').should('have.been.calledWith', 'Registered! Please log in.')

    cy.url().should('include', '/login')
  })
})
