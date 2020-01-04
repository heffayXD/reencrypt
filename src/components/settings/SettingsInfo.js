import React from 'react'

const SettingsInfo = props => {
  return (
    <div className='setting-container setting-info'>
      <h3>{props.title}</h3>
      <h4 className='info'>{props.value}</h4>
    </div>
  )
}

export default SettingsInfo
