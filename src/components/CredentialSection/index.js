import React from 'react'
import './credential-section.scss'

import CredentialList from './components/CredentialList'

const CredentialSelection = props => {
  const { handleSubmit, data, loaded, password, setPassword } = props

  const handlePassword = e => {
    setPassword(e.target.value)
  }

  const getContents = () => {
    if (!data) {
      return (<div className='select-file'><h2>Please select a file</h2></div>)
    }

    if (!loaded) {
      return (
        <div className='enter-password'>
          <form onSubmit={handleSubmit}>
            <div className='input-container'>
              <h2>Enter File Password</h2>
              <input
                type='password'
                onChange={handlePassword}
                name='password'
                value={password}
                placeholder='Password'
              />
            </div>
            <button type='submit'>Submit</button>
          </form>
        </div>
      )
    }

    return (<CredentialList />)
  }

  return (
    <div id='credential-section'>
      {getContents()}
    </div>
  )
}

export default CredentialSelection
