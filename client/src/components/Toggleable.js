import React, { useState, useImperativeHandle } from 'react'

const Toggleable = React.forwardRef((props, ref) => {
  const { actionButtonLabel, cancelButtonLabel, children } = props
  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }
  const hideWhenVisible = { display: visible ? 'none' : '' }

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(ref, () => ({
    toggleVisibility,
    visible,
  }))

  return (
    <>
      <div style={showWhenVisible} data-test="togglable-content">
        {children}
        {cancelButtonLabel ? (
          <button onClick={toggleVisibility}>{cancelButtonLabel}</button>
        ) : (
          ''
        )}
      </div>
      <div style={hideWhenVisible}>
        {actionButtonLabel ? (
          <button
            data-test="toggle-content-action-show"
            onClick={toggleVisibility}
          >
            {actionButtonLabel}
          </button>
        ) : (
          ''
        )}
      </div>
    </>
  )
})

Toggleable.displayName = 'Toggleable'

export default Toggleable
