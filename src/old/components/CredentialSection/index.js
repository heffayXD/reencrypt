import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './credential-section.scss'

import CredentialList from './components/CredentialList'

import { useIpcRenderer } from '../../hooks/electron'

const CredentialSelection = () => {
  const { data, name } = useSelector(state => state.fileList.selected)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const setHash = useIpcRenderer('hash')
  const decrypt = useIpcRenderer('decrypt')
  const dispatch = useDispatch()

  const handlePassword = e => {
    setPassword(e.target.value)
  }

  const handleSubmit = async e => {
    try {
      e.preventDefault()
      if (loading) return
      setLoading(true)
      setError('')

      // Generate the key hash
      const [hashed, hash] = await setHash(password)
      if (!hashed) throw hash

      dispatch({ type: 'UPDATE_CONFIG', config: 'key', value: hash })

      const [decrypted, credentials] = await decrypt({ data, key: hash })
      if (!decrypted) throw credentials

      dispatch({ type: 'SET_CREDENTIALS', credentials })
      setLoaded(true)
      setLoading(false)
    } catch (err) {
      setError('Incorrect Password')
    }
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
