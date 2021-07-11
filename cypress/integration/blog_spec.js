import blogFactory from '../factories/blogFactory'
import userFactory from '../factories/userFactory'
import { sortBlogByLikesDesc } from '../helpers'

const blog = blogFactory()
const user = userFactory()
const blogs = blogFactory(3)

describe('Blog app', function () {
  beforeEach(function () {
    cy.resetDb()
    cy.visit('/')
  })

  it('Login form can be opened', function () {
    cy.get('[data-test="toggle-content-action-show"]')
      .contains('log in')
      .click()
    cy.get('html').should('contain', 'Login to application')
  })

  describe('Login', function () {
    beforeEach(function () {
      cy.request({
        method: 'POST',
        url: '/api/users',
        headers: { 'Accept-Language': 'en-us' },
        body: user,
      })
      cy.get('[data-test="toggle-content-action-show"]')
        .contains('log in')
        .click()
    })
    it('Login fails when username and password are incorrect', function () {
      cy.get('[data-test="login-username-input"]').type(user.username)
      cy.get('[data-test="login-password-input"]').type(`${user.password}1`)
      cy.get('[data-test="login-button"]').click()
      cy.get('.error').should('contain', 'Invalid Credentials')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'Logged in as')
    })

    it('user can login with valid credentials', function () {
      cy.get('[data-test="login-username-input"]').type(user.username)
      cy.get('[data-test="login-password-input"]').type(user.password)
      cy.get('[data-test="login-button"]').click()
      cy.get('html').should('contain', 'Logged in as:')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.createUser(user)
      cy.login({ username: user.username, password: user.password })
    })
    it('user can create a blog', function () {
      cy.contains('Create a new blog').click()
      cy.get('[data-test="blog-title-input"]').type('A cypresss blog')
      cy.get('[data-test="blog-url-input"]').type('web.blog.com')
      cy.get('[data-test="blog-author-input"]').type('Cypress Runner')
      cy.get('[data-test="blog-add-button"]').click()
      cy.get('.success').should('contain', 'New Blog Created')
      cy.get('[data-test="blog-preview-title"]').should(
        'have.text',
        'A cypresss blog'
      )
    })

    it('user can like a blog', function () {
      cy.createBlog(blog)
      cy.get('[data-test="view-blog-button"]').click()
      cy.get('[data-test="like-blog-button"]').as('likeBlogButton').click()
      cy.get('@likeBlogButton').should('contain', `${blog.likes + 1} likes`)
    })

    it('user can delete a blog created by self', function () {
      cy.createBlog(blog)
      cy.get('[data-test="view-blog-button"]').click()
      cy.get('.blog')
        .find('[data-test="delete-blog-button"]')
        .as('deleteBlogButton')
        .should('contain', 'delete')
      cy.get('@deleteBlogButton').click()
      cy.get('.blog').should('not.exist')
    })

    // it('user cannot delete a blog created by others', function () {
    //   cy.createBlog(blog)
    //   cy.logout()
    //   const newUser = userFactory()
    //   cy.createUser(newUser)
    //   cy.login({ username: newUser.username, password: newUser.password })
    //   cy.get('.blog')
    //     .find('[data-test="delete-blog-button"]')
    //     .should('not.contain', 'delete')
    // })

    describe('and there are several blogs in db', function () {
      beforeEach(function () {
        for (let newBlog of blogs) {
          cy.createBlog(newBlog)
        }
      })
      it('blogs are ordered in descending order according to likes', function () {
        cy.request({
          method: 'GET',
          url: '/api/blogs',
          headers: { 'Accept-Language': 'en-us' },
        }).then((res) => {
          const sortedBlogs = [...res.body].sort(sortBlogByLikesDesc)
          const ids = sortedBlogs.map((blog) => blog.id)
          cy.get('div.blog:nth-child(1)').should('have.id', `${ids[0]}`)
          cy.get('div.blog:nth-child(2)').should('have.id', `${ids[1]}`)
          cy.get('div.blog:nth-child(3)').should('have.id', `${ids[2]}`)
        })
      })
    })
  })
})

after(function () {
  cy.request('POST', '/api/testing/reset')
})
