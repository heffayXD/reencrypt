import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Toolbar from '../components/Toolbar'
import FileSelect from '../components/FileSelect'
import CredentialSection from '../components/CredentialSection'
import Modal from '../components/Modal'

import { useIpcRenderer } from '../hooks/electron'
import { indexFiles } from '../helpers/api'
import CreateFile from '../components/Modal/components/CreateFile'

const OnlineList = props => {
  const [url, setUrl] = useState('http://localhost:8086/api')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [data, setData] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [hidden, setHidden] = useState(true)
  const history = useHistory()
  const dispatch = useDispatch()
  const setHash = useIpcRenderer('hash')
  const decrypt = useIpcRenderer('decrypt')

  const getFiles = async () => {
    try {
      setLoading(true)

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

  useEffect(() => { getFiles() }, [])

  /**
   * Handles setting an error
   * @param {string} error
   */
  const handleError = err => {
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
            reset={reset}
            setData={setData}
            files={files}
            handleModal={() => { setHidden(false) }}
          />
        </div>
        <CredentialSection
          handleSubmit={handleSubmit}
          data={data}
          loaded={loaded}
          password={password}
          setPassword={setPassword}
        />
        <Modal hidden={hidden} setHidden={setHidden}>
          <CreateFile setHidden={setHidden} getFiles={getFiles} />
        </Modal>
      </main>
    </div>
  )
}

export default OnlineList
