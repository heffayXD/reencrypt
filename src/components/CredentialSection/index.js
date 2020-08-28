import React from 'react'
import { useSelector } from 'react-redux'
import './credential-section.scss'

import CredentialList from './components/CredentialList'

const CredentialSelection = props => {
  const { handleSubmit, loaded, password, setPassword, error } = props
  const { data, name } = useSelector(state => state.fileList.selected)

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
              <h2>Enter Password for {name}</h2>
              <input
                type='password'
                onChange={handlePassword}
                name='password'
                value={password}
                placeholder='Password'
              />
            </div>
            <button type='submit'>Submit</button>
            {error ? (<p className='error'>{error}</p>) : ''}
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
