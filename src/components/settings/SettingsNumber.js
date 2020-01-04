import React from 'react'

const SettingsNumber = props => {
  return (
    <div className='settings-number setting-container'>
      <h4 className='setting-title'>{props.title}</h4>
      <input
        type='number'
        min={props.min || 1}
        max={props.max || 24}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
      />
      {props.description ? (
        <p className={`setting-description ${props.danger ? 'danger' : ''}`}>
          {props.description}
        </p>
      ) : ''}
    </div>
  )
}

export default SettingsNumber
