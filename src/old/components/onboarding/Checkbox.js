import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const Checkbox = props => {
  return (
    <div className='checkbox'>
      <label className='checkmark-container' tabIndex='0'>
        <input
          type='checkbox'
          name={props.name || ''}
          checked={props.checked}
          onChange={props.onChange}
        />
        <span className='checkmark'>
          <FontAwesomeIcon icon={faCheck} />
        </span>
        {props.text}
      </label>
    </div>
  )
}

export default Checkbox
