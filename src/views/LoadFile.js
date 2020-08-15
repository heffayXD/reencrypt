import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Toolbar from '../components/Toolbar'
import Checkbox from '../components/onboarding/Checkbox'

import { useIpcRenderer } from '../hooks/electron'
import { useSaveSettings } from '../hooks/helpers'

const LoadFile = props => {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const config = useSelector(state => state.config)
  const dispatch = useDispatch()
  const history = useHistory()
  const setFile = useIpcRenderer('file')
  const setHash = useIpcRenderer('hash')
  const loadFile = useIpcRenderer('load')
  const saveSettings = useSaveSettings()

  const handleError = error => {
    setError(error)
    setLoading(false)
  }

  /**
   * Handles the select file event
   * @param {object} e
   */
  const handleFileSelect = async e => {
    if (error) setError('')
    setLoading(true)
    const [success, file] = await setFile()

    if (success) {
      dispatch({ type: 'UPDATE_CONFIG', config: 'file', value: file })
      setLoading(false)
    } else {
      handleError('Could not load file')
    }
  }

  /**
   * Handles setting password value
   * @param {object} e
   */
  const handlePassword = e => {
    if (error) setError('')
    setPassword(e.target.value)
  }

  /**
   * Handles remember event
   * @param {object} e
   */
  const handleRemember = e => {
    dispatch({ type: 'UPDATE_CONFIG', config: e.target.name, value: e.target.checked })
  }

  /**
   * Handles submission of the form
   * @param {object} e
   */
  const handleSubmit = async e => {
    // Reset defaults
    e.preventDefault()
    if (loading || !config.file || !password) return
    if (error) setError('')
    setLoading(true)

    // Generate the key hash
    const [hashed, hash] = await setHash(password)
    if (!hashed) {
      handleError('Hashing failed')
      return
    }

    dispatch({ type: 'UPDATE_CONFIG', config: 'key', value: hash })

    // Load credentials from the file
    const [loaded, credentials] = await loadFile({ file: config.file, key: hash })
    if (!loaded) {
      handleError('Incorrect file or password')
      return
    }

    // Set credentials and finish loading process
    saveSettings()
    dispatch({ type: 'SET_CREDENTIALS', credentials })
    setLoading(false)
    dispatch({ type: 'UPDATE_CONFIG', config: 'loaded', value: true })
  }

  return (
    <div>
      <Toolbar />
      <main id='load-file'>
        <form onSubmit={handleSubmit}>

          <div className='select-file'>
            <h3>{config.file ? 'File Selected' : 'Load a File'}</h3>
            {config.file ? (<p>{config.file}</p>) : ''}
            <div className='select-container'>
              <button type='button' onClick={handleFileSelect}>
                {config.file ? 'Change' : 'Select File'}
              </button>
              {config.file ? (
                <Checkbox
                  text='Remember'
                  name='rememberFile'
                  checked={config.rememberFile}
                  onChange={handleRemember}
                />
              ) : ''}
            </div>
          </div>

          <div className='enter-password'>
            <h3>Enter File Password</h3>
            <input
              type='password'
              value={password}
              placeholder='Password'
              onChange={handlePassword}
            />
          </div>

          <div className='submit'>
            <input
              type='submit'
              disabled={loading || (!password || !config.file)}
              value={loading ? 'Loading' : 'Submit'}
            />
            {error ? (<p className='error'>{error}</p>) : ''}
          </div>

          <div className='save'>
            <p className='button' onClick={() => history.push('/create')}>or Create New</p>
          </div>
          <div className='save'>
            <p className='button' onClick={() => history.push('/sign-in')}>or Sign In (in development)</p>
          </div>
        </form>
      </main>
    </div>
  )
}

export default LoadFile
