import PropTypes from 'prop-types'
import React from 'react'

const User = (props) => {
  const { user, handleLogout } = props
  return (
    <div className="flex panel">
      <p className="subtitle">
        <span role="img" aria-label="user emoji">
          👤&nbsp;&nbsp;
        </span>
        Logged in as: <span className="title"> {user.username}</span>
      </p>
      <button id="logout-button" onClick={handleLogout}>
        logout
      </button>
    </div>
  )
}

User.propTypes = {
  user: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired,
}

export default User
