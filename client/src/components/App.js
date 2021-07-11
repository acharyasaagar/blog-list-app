import React, { useState, useEffect, useRef } from 'react'

import Blog from './Blog'
import CreateBlog from './CreateBlog'
import Login from './Login'
import Notification from './Notification'
import Signup from './Signup'
import User from './User'

import blogService from '../services/blog'
import Toggleable from './Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(null)
  const [success, setSuccess] = useState(null)

  const sortedBlogs = blogs.sort((first, second) => second.likes - first.likes)

  const checkLoggedUser = () => {
    const user = window.localStorage.getItem('loggedUser')
    setUser(JSON.parse(user))
  }
  const populateBlogs = () => {
    async function getBlogs() {
      const blogs = await blogService.getAll()
      setBlogs([...blogs.data])
    }
    getBlogs()
  }
  const createBlog = async (blog) => {
    try {
      const { data } = await blogService.create(blog)
      setBlogs(blogs.concat(data))
      blogFormRef.current.toggleVisibility()
    } catch (err) {
      throw new Error('Error creating blog')
    }
  }

  const likeBlog = async (blogId) => {
    try {
      const { data } = await blogService.like(blogId)
      setBlogs(blogs.filter((blog) => blog.id !== blogId).concat(data))
    } catch (err) {
      console.log(err)
      setErr({ message: 'Error liking blog' })
      setTimeout(() => setErr(null), 5000)
    }
  }

  // const updateBlog = async (updatedBlog, blogId) => {
  //   try {
  //     const { data } = await blogService.update(updatedBlog, blogId)
  //     setBlogs(blogs.filter(blog => blog.id !== blogId).concat(data))
  //   } catch (err) {
  //     console.log(err)
  //     setErr({ message: 'Error updating blog' })
  //     setTimeout(() => setErr(null), 5000)
  //   }
  // }

  const deleteBlog = async (blogId) => {
    try {
      await blogService.remove(blogId)
      setBlogs(blogs.filter((blog) => blog.id !== blogId))
    } catch (err) {
      console.log(err)
      setErr({ message: 'Error deleting blog' })
      setTimeout(() => setErr(null), 5000)
    }
  }

  useEffect(populateBlogs, [])
  useEffect(checkLoggedUser, [])

  const blogFormRef = useRef()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const loginForm = () => (
    <>
      <Toggleable actionButtonLabel="log in" cancelButtonLabel="cancel">
        <Login setUser={setUser} />
      </Toggleable>
      <Toggleable actionButtonLabel="sign up" cancelButtonLabel="cancel">
        <Signup setUser={setUser} />
      </Toggleable>
    </>
  )

  const showUser = (user) => <User user={user} handleLogout={handleLogout} />

  return (
    <>
      <Notification err={err} success={success} />
      {user === null ? loginForm() : showUser(user)}
      <br></br>
      <br></br>
      {user === null ? (
        ''
      ) : (
        <>
          <h2>
            <span role="img" aria-label="blog emoji">
              📋&nbsp;&nbsp;
            </span>
            Blogs
          </h2>
          <br></br>
          <br></br>
          <div className="panel">
            <Toggleable
              actionButtonLabel="Create a new blog"
              cancelButtonLabel="close &nbsp;&nbsp;✖️"
              ref={blogFormRef}
            >
              <CreateBlog createBlog={createBlog} setSuccess={setSuccess} />
            </Toggleable>
          </div>
          <div id="blogs">
            {sortedBlogs.map((blog) => (
              <Blog
                blog={blog}
                likeBlog={likeBlog}
                deleteBlog={deleteBlog}
                key={blog.id}
                user={user}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default App
