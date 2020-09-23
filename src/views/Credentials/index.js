import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './credentials.scss'

import { useAPI } from '../../hooks/api'

const Credentials = () => {
  const [loading, setLoading] = useState(false)
  const [user, files] = useSelector(state => [state.user, state.fileList.files])
  const getFiles = useAPI('/file', 'get')
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    const init = async () => {
      try {
        const [success, result] = await getFiles()
        if (!success) throw result

        dispatch({ type: 'SET_FILES', files: result.files })
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
      <h1>Credentials</h1>
      {loading ? (<p>Loading...</p>) : ''}
    </div>
  )
}

export default Credentials
