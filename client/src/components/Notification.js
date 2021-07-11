import React from 'react'

const Notification = (props) => {
  const { err, success } = props
  return (
    <div className={`${err ? 'error' : ''} ${success ? 'success' : ''}`}>
      <p>{err ? err.message : ''}</p>
      <p>{success ? success.message : ''}</p>
    </div>
  )
}

export default Notification
