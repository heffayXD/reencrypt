import React from 'react'

const SettingsButton = props => {
  return (
    <div
      className={`setting-button ${props.danger ? 'danger' : ''}`}
      onClick={props.onClick}
    >
      <h4>{props.value}</h4>
    </div>
  )
}

export default SettingsButton
