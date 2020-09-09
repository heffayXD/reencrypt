import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './online-list.scss'

import { indexFiles } from '../../helpers/api'

import Toolbar from '../../components/Toolbar'
import FileSelect from '../../components/FileSelect'
import CredentialSection from '../../components/CredentialSection'
import Modal from '../../components/Modal'
import CreateFile from '../../components/Modal/components/CreateFile'

const OnlineList = props => {
  const url = useSelector(state => state.config.url)
  const [loading, setLoading] = useState(false)
  const [hidden, setHidden] = useState(true)
  const history = useHistory()
  const dispatch = useDispatch()

  const getFiles = async () => {
    try {
      if (loading) return
      setLoading(true)

      const [success, result] = await indexFiles(url)
      if (!success) throw result

      dispatch({ type: 'SET_FILES', files: result.files })
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
      history.push('/sign-in')
    }
  }

  useEffect(() => { getFiles() }, [])

  return (
    <div>
      <Toolbar />
      <main id='online-list'>
        <div className='sidebar'>
          <FileSelect
            handleModal={() => { setHidden(false) }}
          />
        </div>
        <CredentialSection />
        <Modal hidden={hidden} setHidden={setHidden}>
          <CreateFile setHidden={setHidden} getFiles={getFiles} />
        </Modal>
      </main>
    </div>
  )
}

export default OnlineList
