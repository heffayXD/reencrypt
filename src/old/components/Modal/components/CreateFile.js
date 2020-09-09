import React, { useState } from 'react'

import { useDispatch } from 'react-redux'

import { useIpcRenderer } from '../../../hooks/electron'
import { createFile } from '../../../helpers/api'

const CreateFile = props => {
  const dispatch = useDispatch()
  const [url, setUrl] = useState('http://localhost:8086/api')
  const encrypt = useIpcRenderer('encrypt')
  const setHash = useIpcRenderer('hash')
  const [fields, setFields] = useState({ name: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * Handles setting an error
   * @param {string} error
   */
  const handleError = err => {
    setError(err || err.message)
    setLoading(false)
  }

  const handleChange = e => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  /**
   * Handles submission of the form
   * @param {object} e
   */
  const handleCreate = async e => {
    try {
      // Reset defaults
      e.preventDefault()
      if (loading) return
      if (error) setError('')
      setLoading(true)

      // Generate the key hash
      const [hashed, hash] = await setHash(fields.password)
      if (!hashed) {
        handleError('Hashing failed')
        return
      }

      dispatch({ type: 'UPDATE_CONFIG', config: 'key', value: hash })

      // Blank credentials to save
      const credentials = [{ id: 1, title: 'Title', username: 'Username', password: '' }]

      // Save the blank credentials
      const [encrypted, data] = await encrypt({ payload: credentials, key: hash })
      if (!encrypted) {
        handleError('Issue creating file')
        return
      }

      const result = await createFile(url, fields.name, data)
      console.log(result)

      dispatch({ type: 'UPDATE_CONFIG', config: 'file', value: fields.name })

      // Set credentials and finish loading proces
      dispatch({ type: 'SET_CREDENTIALS', credentials })

      props.getFiles()
      setFields({ name: '', password: '', confirm: '' })
      setLoading(false)
      props.setHidden(true)
    } catch (err) {
      handleError(err)
    }
  }

  return (
    <form id='create-file-modal' onSubmit={handleCreate}>

      <div className='enter-name'>
        <h3>Create File Name</h3>
        <input
          type='text'
          value={fields.name}
          placeholder='Name'
          onChange={handleChange}
          name='name'
        />
      </div>

      <div className='enter-password'>
        <h3>Create File Password</h3>
        <input
          type='password'
          value={fields.password}
          placeholder='Password'
          onChange={handleChange}
          name='password'
        />
      </div>

      <div className='confirm-password'>
        <h3>Confirm Password</h3>
        <input
          type='password'
          value={fields.confirm}
          placeholder='Confirm'
          onChange={handleChange}
          name='confirm'
        />
        {fields.password !== fields.confirm ? (<p className='error'>Passwords do not match</p>) : ''}
      </div>

      <div className='submit-container'>
        <input
          type='submit'
          disabled={loading}
          value={loading ? 'Loading' : 'Submit'}
        />
        <button
          onClick={() => { props.setHidden(true) }}
        >
          Cancel
        </button>
        {error ? (<p className='error'>{error}</p>) : ''}
      </div>

    </form>
  )
}

export default CreateFile
