import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './credentials.scss'

import CredentialList from './components/CredentialList'
import Sidebar from './components/Sidebar'
import { useInitFiles } from '../../hooks/helpers'

const Credentials = () => {
  const [loading, setLoading] = useState(false)
  const [user, files] = useSelector(state => [state.user, state.fileList.files])
  const initFiles = useInitFiles()
  const history = useHistory()

  useEffect(() => {
    const init = async () => {
      try {
        const [success, data] = await initFiles()
        if (!success) throw data

        console.log(data)

        setLoading(false)
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    }

    if (!user.id) {
      history.push('/')
    } else if (!files.length) {
      setLoading(true)
      init()
    }
  }, [])

  return (
    <div id='credentials'>
      <Sidebar />
      {
        loading
          ? (<p>Loading...</p>)
          : (<CredentialList />)
      }
    </div>
  )
}

export default Credentials
