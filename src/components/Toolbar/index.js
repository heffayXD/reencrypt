import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import './toolbar.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'

import { useBrowserWindow } from '../../hooks/electron'

const Toolbar = props => {
  const handleWindow = useBrowserWindow()
  const location = useLocation()
  const history = useHistory()

  const handleClick = e => {
    history.push('/settings')
  }

  return (
    <div id='toolbar'>
      <h1>re:Encrypt</h1>
      <div className='draggable' />
      <div id='toolbar-buttons'>
        {location.pathname !== '/settings' ? (
          <div className='button-container' onClick={handleClick}>
            <FontAwesomeIcon icon={faCog} />
          </div>
        ) : ''}
        <div className='button-container' onClick={() => { handleWindow('minimize') }}>
          <p>&#8212;</p>
        </div>
        <div className='button-container larger' onClick={() => { handleWindow('maximize') }}>
          <p>&#9633;</p>
        </div>
        <div className='button-container alert' onClick={() => { handleWindow('close') }}>
          <p>&#10005;</p>
        </div>
      </div>
    </div>
  )
}

export default Toolbar
