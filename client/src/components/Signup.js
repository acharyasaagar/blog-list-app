import PropTypes from 'prop-types'
import React, { useState } from 'react'

import authService from '../services/auth'

import Notification from './Notification'

const Signup = (props) => {
  const { setUser } = props

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)

  const handlePasswordChange = (e) => setPassword(e.target.value)
  const handleUsernameChange = (e) => setUsername(e.target.value)
  const handleNameChange = (e) => setName(e.target.value)

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const res = await authService.signup({ name, username, password })
      const user = Object.assign({}, res.data)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      authService.setToken(user.token)
    } catch (e) {
      setErr({ message: 'Signup Failed' })
      setTimeout(() => setErr(null), 5000)
    }
  }

  return (
    <div className="panel">
      <Notification err={err} success={null} />
      <h4>New user?</h4>
      <h4>Create a new Account from here</h4>
      <form onSubmit={handleSignup}>
        <section>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            data-test="signup-name-input"
            value={name}
            onChange={handleNameChange}
          />
        </section>
        <section>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            data-test="signup-username-input"
            value={username}
            onChange={handleUsernameChange}
          />
        </section>
        <section>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            data-test="signup-password-input"
            value={password}
            onChange={handlePasswordChange}
          />
        </section>
        <button type="submit" data-test="signup-button">
          Sign up
        </button>
      </form>
    </div>
  )
}

Signup.propTypes = {
  setUser: PropTypes.func.isRequired,
}

export default Signup
