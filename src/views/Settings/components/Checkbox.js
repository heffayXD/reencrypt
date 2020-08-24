import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const SettingsCheckbox = props => {
  return (
    <div className='settings-checkbox setting-container'>
      <h4 className='setting-title'>{props.title}</h4>
      <label className='checkmark-container' tabIndex='100'>
        <input type='checkbox' name={props.name} checked={props.value} onChange={props.onChange} />
        <span className='checkmark'>
          <FontAwesomeIcon icon={faCheck} />
        </span>
      </label>
      {props.description ? (
        <p className={`setting-description ${props.danger ? 'danger' : ''}`}>
          {props.description}
        </p>
      ) : ''}
    </div>
  )
}

export default SettingsCheckbox
