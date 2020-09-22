import React from 'react'
import { useHistory } from 'react-router-dom'
import './settings.scss'

const Settings = () => {
  const history = useHistory()

  const handleBack = e => {
    history.goBack()
  }

  return (
    <div id='settings'>
      <h1>Settings</h1>
      <button onClick={handleBack}>Back</button>
    </div>
  )
}

export default Settings
