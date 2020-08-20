import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Toolbar from '../components/Toolbar'
import FileSelect from '../components/FileSelect'
import CredentialSection from '../components/CredentialSection'

import { useIpcRenderer } from '../hooks/electron'
import { useSaveSettings } from '../hooks/helpers'
import { indexFiles, createFile } from '../helpers/api'

const OnlineList = props => {
  const [url, setUrl] = useState('http://localhost:8086/api')
  const [files, setFiles] = useState([])
  const [fields, setFields] = useState({ name: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [data, setData] = useState('')
  const [loaded, setLoaded] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()
  const setHash = useIpcRenderer('hash')
  const encrypt = useIpcRenderer('encrypt')
  const decrypt = useIpcRenderer('decrypt')
  const saveSettings = useSaveSettings()

  useEffect(() => {
    const getFiles = async () => {
      try {
        const [success, result] = await indexFiles(url)
        if (!success) throw result

        setFiles(result.files)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
        history.push('/sign-in')
      }
    }

    setLoading(true)
    getFiles()
  }, [])

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

      setLoading(false)
    } catch (err) {
      handleError(err)
    }

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

    // dispatch({ type: 'UPDATE_CONFIG', config: 'file', value: file })

    // Set credentials and finish loading proces
    // saveSettings({ config: { file: rememberFile ? file : '', rememberFile } })
    // dispatch({ type: 'SET_CREDENTIALS', credentials })
    // setLoading(false)
    // dispatch({ type: 'UPDATE_CONFIG', config: 'loaded', value: true })
    // history.push('/')
  }

  const handleSubmit = async e => {
    try {
      e.preventDefault()

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
      console.log(err)
      setLoading(false)
    }
  }

  return (
    <div>
      <Toolbar />
      <main id='online-list'>
        <div className='sidebar'>
          <FileSelect
            setPassword={setPassword}
            setData={setData}
            files={files}
          />
        </div>
        <CredentialSection
          handleSubmit={handleSubmit}
          data={data}
          loaded={loaded}
          password={password}
          setPassword={setPassword}
        />
        {/* <form onSubmit={handleCreate}>
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

          <div className='submit'>
            <input
              type='submit'
              disabled={loading}
              value={loading ? 'Loading' : 'Submit'}
            />
            {error ? (<p className='error'>{error}</p>) : ''}
          </div>

          <div className='load'>
            <p className='button' onClick={() => history.push('/')}>or Create File</p>
          </div>

        </form> */}
      </main>
    </div>
  )
}

export default OnlineList
