import React from 'react'
import './text.scss'

const SettingsText = props => {
  return (
    <div className='settings-text setting-container'>
      <h4 className='setting-title'>{props.title}</h4>
      <input
        type={props.password ? 'password' : 'text'}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        tabIndex='0'
        placeholder={props.placeholder}
      />
      {props.description ? (
        <p className={`setting-description ${props.danger ? 'danger' : ''}`}>
          {props.description}
        </p>
      ) : ''}
    </div>
  )
}

export default SettingsText
