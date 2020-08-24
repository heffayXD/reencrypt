import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

const SettingsExpand = props => {
  const [expanded, setExpanded] = useState(false)

  /**
   * Handles the expand event
   */
  const handleClick = () => {
    setExpanded(!expanded)
  }

  return (
    <div className='settings-expand'>
      <div className='expand-select setting-button' onClick={handleClick}>
        <h4>{props.title || 'Advanced'} </h4>
        <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
      </div>
      <div className={`expand-content ${expanded ? 'expanded' : ''}`}>
        {props.children}
      </div>
    </div>
  )
}

export default SettingsExpand
