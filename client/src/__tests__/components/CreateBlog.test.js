import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import CreateBlog from '../../components/CreateBlog'
import { act } from 'react-dom/test-utils'

describe('<CreateBlog />', () => {
  let blog, createBlog, createBlogComponent, promise, qs, setSuccess
  beforeEach(() => {
    promise = Promise.resolve()

    createBlog = jest.fn(() => promise)
    setSuccess = jest.fn()
    blog = {
      title: 'Blog title lorem',
      author: 'John Doe',
      url: 'https://mde.com/kipsum',
    }

    createBlogComponent = render(
      <CreateBlog createBlog={createBlog} setSuccess={setSuccess} />
    )

    qs = createBlogComponent.container.querySelector.bind(
      createBlogComponent.container
    )
  })
  it('should call the event handler it received as props with right details', async () => {
    const blogCreateForm = qs('[data-test="create-blog-form"]')
    const blogTitleInput = qs('[data-test="blog-title-input"]')
    const blogUrlInput = qs('[data-test="blog-url-input"]')
    const blogAuthorInput = qs('[data-test="blog-author-input"]')

    fireEvent.change(blogTitleInput, { target: { value: blog.title } })
    fireEvent.change(blogUrlInput, { target: { value: blog.url } })
    fireEvent.change(blogAuthorInput, { target: { value: blog.author } })

    fireEvent.submit(blogCreateForm)
    expect(createBlog.mock.calls[0][0]).toEqual(blog)
    await act(() => promise)
  })
})
