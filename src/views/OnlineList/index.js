import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './online-list.scss'

import { useIpcRenderer } from '../../hooks/electron'
import { indexFiles } from '../../helpers/api'

import Toolbar from '../../components/Toolbar'
import FileSelect from '../../components/FileSelect'
import CredentialSection from '../../components/CredentialSection'
import Modal from '../../components/Modal'
import CreateFile from '../../components/Modal/components/CreateFile'

const OnlineList = props => {
  const [url, { data }] = useSelector(state => [state.config.url, state.fileList.selected])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [hidden, setHidden] = useState(true)
  const history = useHistory()
  const dispatch = useDispatch()
  const setHash = useIpcRenderer('hash')
  const decrypt = useIpcRenderer('decrypt')

  const getFiles = async () => {
    try {
      if (loading) return
      setLoading(true)
      setError('')

      const [success, result] = await indexFiles(url)
      if (!success) throw result

      dispatch({ type: 'SET_FILES', files: result.files })
      setLoading(false)
    } catch (err) {
      handleError(err)
      history.push('/sign-in')
    }
  }

  useEffect(() => { getFiles() }, [])

  /**
   * Handles setting an error
   * @param {string} error
   */
  const handleError = err => {
    console.error(err || err.message)
    setError(err || err.message)
    setLoading(false)
  }

  const reset = () => {
    setLoaded(false)
    setPassword('')
    dispatch({ type: 'UPDATE_CONFIG', config: 'key', value: '' })
    dispatch({ type: 'RESET_CREDENTIALS' })
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
      handleError('Incorrect Password')
    }
  }

  return (
    <div>
      <Toolbar />
      <main id='online-list'>
        <div className='sidebar'>
          <FileSelect
            setPassword={setPassword}
            reset={reset}
            handleModal={() => { setHidden(false) }}
          />
        </div>
        <CredentialSection
          handleSubmit={handleSubmit}
          loaded={loaded}
          password={password}
          setPassword={setPassword}
          error={error}
        />
        <Modal hidden={hidden} setHidden={setHidden}>
          <CreateFile setHidden={setHidden} getFiles={getFiles} />
        </Modal>
      </main>
    </div>
  )
}

export default OnlineList
