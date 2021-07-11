import PropTypes from 'prop-types'
import React, { useState } from 'react'

import Notification from './Notification'

const CreateBlog = (props) => {
  const { createBlog, setSuccess } = props
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')
  const [err, setErr] = useState(null)

  const handleAddBlog = async (e) => {
    e.preventDefault()
    const newBlog = {
      author,
      title,
      url,
    }
    try {
      await createBlog(newBlog)
      setTitle('')
      setUrl('')
      setAuthor('')
      setSuccess({ message: 'New Blog Created' })
      setTimeout(() => setSuccess(null), 5000)
    } catch (err) {
      console.log(err.message)
      setTitle('')
      setUrl('')
      setAuthor('')
      setErr({ message: err.message })
      setTimeout(() => setErr(null), 5000)
    }
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }

  const handleUrlChange = (e) => {
    setUrl(e.target.value)
  }

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value)
  }

  return (
    <div>
      <Notification err={err} />
      <h4>
        Create Blog
        <span role="img" aria-label="user emoji">
          &nbsp;&nbsp;📝
        </span>
      </h4>
      <form onSubmit={handleAddBlog} data-test="create-blog-form">
        <section>
          <label htmlFor="title">Blog Title:</label>
          <input
            data-test="blog-title-input"
            type="text"
            name="title"
            value={title}
            onChange={handleTitleChange}
          />
        </section>
        <section>
          <label htmlFor="url">Blog URL: </label>
          <input
            data-test="blog-url-input"
            value={url}
            type="text"
            name="url"
            onChange={handleUrlChange}
          />
        </section>
        <section>
          <label htmlFor="author">Author: </label>
          <input
            data-test="blog-author-input"
            value={author}
            type="text"
            name="author"
            onChange={handleAuthorChange}
          />
        </section>
        <button type="submit" data-test="blog-add-button">
          add blog
          <span role="img" aria-label="user emoji">
            &nbsp;&nbsp;➕
          </span>
        </button>
      </form>
    </div>
  )
}

CreateBlog.propTypes = {
  createBlog: PropTypes.func.isRequired,
  setSuccess: PropTypes.func.isRequired,
}

export default CreateBlog
