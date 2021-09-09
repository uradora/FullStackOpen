describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'test',
      password: 'topsecret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('test')
      cy.get('#password').type('topsecret')
      cy.get('#login-button').click()

      cy.contains('\'test\' logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('test')
      cy.get('#password').type('ää')
      cy.get('#login-button').click()

      cy.contains('login failed')
      cy.get('.error')
        .should('contain', 'login failed')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
      username: 'test', password: 'topsecret'
    }).then(response => {
      localStorage.setItem('loggedInUser', JSON.stringify(response.body))
      cy.visit('http://localhost:3000')
    })
  })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('test blog')
      cy.get('#author').type('test author')
      cy.get('#url').type('test url')
      cy.get('#createblog').click()

      cy.contains('test blog')
    })

    it('A blog can be liked', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('test blog')
      cy.get('#author').type('test author')
      cy.get('#url').type('test url')
      cy.get('#createblog').click()
      cy.contains('view').click()
      cy.contains('0')
      cy.contains('like').click()

      cy.contains('like added for test blog')
      cy.contains('1')
    })
    
    it('A blog can be deleted', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('test blog')
      cy.get('#author').type('test author')
      cy.get('#url').type('test url')
      cy.get('#createblog').click()
      cy.contains('view').click()
      cy.contains('remove').click()

      cy.get('html').should('not.contain', 'test url')

    })
  })
})
