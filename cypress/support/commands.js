// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('createUser', (user) => {
  cy.request({
    method: 'POST',
    url: '/api/users',
    headers: { 'Accept-Language': 'en-us' },
    body: user,
  })
})

Cypress.Commands.add('login', (credentials) => {
  cy.request({
    method: 'POST',
    url: '/api/login',
    headers: { 'Accept-Language': 'en-us' },
    body: credentials,
  }).then((res) => {
    const { body } = res
    window.localStorage.setItem('loggedUser', JSON.stringify(body))
    cy.visit('/')
  })
})

Cypress.Commands.add('createBlog', (blog) => {
  const token = JSON.parse(window.localStorage.getItem('loggedUser')).token
  cy.request({
    method: 'POST',
    url: '/api/blogs',
    headers: {
      'Accept-Language': 'en-us',
      Authorization: `bearer ${token}`,
    },
    body: blog,
  }).then(() => {
    cy.visit('/')
  })
})

Cypress.Commands.add('resetDb', () => {
  cy.request('POST', '/api/testing/reset')
})

Cypress.Commands.add('logout', () => {
  cy.get('#logout-button').click()
  cy.visit('/')
})
