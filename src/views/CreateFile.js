import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Toolbar from '../components/Toolbar'
import Checkbox from '../components/onboarding/Checkbox'

import { useIpcRenderer } from '../hooks/electron'
import { useSaveSettings } from '../hooks/helpers'

const CreateFile = props => {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberFile, setRememberFile] = useState(true)
  const history = useHistory()
  const dispatch = useDispatch()
  const setHash = useIpcRenderer('hash')
  const saveAs = useIpcRenderer('saveas')
  const saveSettings = useSaveSettings()

  /**
   * Handles setting an error
   * @param {string} error
   */
  const handleError = error => {
    setError(error)
    setLoading(false)
  }

  /**
   * Handles setting password value
   * @param {object} e
   */
  const handlePassword = e => {
    setPassword(e.target.value)
  }

  /**
   * Handles setting confirm value
   * @param {object} e
   */
  const handleConfirm = e => {
    setConfirm(e.target.value)
  }

  /**
   * Handles setting remember value
   * @param {object} e
   */
  const handleRemember = e => {
    setRememberFile(e.target.checked)
  }

  /**
   * Handles submission of the form
   * @param {object} e
   */
  const handleSubmit = async e => {
    // Reset defaults
    e.preventDefault()
    if (loading || !password || password !== confirm) return
    if (error) setError('')
    setLoading(true)

    // Generate the key hash
    const [hashed, hash] = await setHash(password)
    if (!hashed) {
      handleError('Hashing failed')
      return
    }

    dispatch({ type: 'UPDATE_CONFIG', config: 'key', value: hash })

    // Blank credentials to save
    const credentials = [{ id: 1, title: 'Title', username: 'Username', password: '' }]

    // Save the blank credentials
    const [loaded, file] = await saveAs({ payload: credentials, key: hash })
    if (!loaded) {
      handleError('Issue creating file')
      return
    }

    dispatch({ type: 'UPDATE_CONFIG', config: 'file', value: file })

    // Set credentials and finish loading proces
    saveSettings({ config: { file: rememberFile ? file : '', rememberFile } })
    dispatch({ type: 'SET_CREDENTIALS', credentials })
    setLoading(false)
    dispatch({ type: 'UPDATE_CONFIG', config: 'loaded', value: true })
    history.push('/')
  }

  return (
    <div>
      <Toolbar />
      <main id='load-file'>
        <form onSubmit={handleSubmit}>

          <div className='enter-password'>
            <h3>Create File Password</h3>
            <input
              type='password'
              value={password}
              placeholder='Password'
              onChange={handlePassword}
            />
          </div>

          <div className='confirm-password'>
            <h3>Confirm Password</h3>
            <input
              type='password'
              value={confirm}
              placeholder='Confirm'
              onChange={handleConfirm}
            />
            {password !== confirm ? (<p className='error'>Passwords do not match</p>) : ''}
          </div>

          <div className='disclaimer'>
            <p className='note'>It's <strong>highly</strong> recommended that you <strong>do not</strong> use the same password for different files.</p>
            <p className='note'>You <strong>cannot</strong> recover a password after it has been set.</p>
          </div>

          <Checkbox
            text='Use as default file'
            name='rememberFile'
            checked={rememberFile}
            onChange={handleRemember}
          />

          <div className='submit'>
            <input
              type='submit'
              disabled={loading || !password || password !== confirm}
              value={loading ? 'Loading' : 'Save As'}
            />
            {error ? (<p className='error'>{error}</p>) : ''}
          </div>

          <div className='load'>
            <p className='button' onClick={() => history.push('/')}>or Load File</p>
          </div>

        </form>
      </main>
    </div>
  )
}

export default CreateFile
