import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './credentials.scss'

import { useAPI } from '../../hooks/api'

const Credentials = () => {
  const getFiles = useAPI('/file', 'get')
  const history = useHistory()
  const user = useSelector(state => state.user)
  console.log(user)

  useEffect(() => {
    const init = async () => {
      try {
        const [success, result] = await getFiles()
        if (!success) throw result

        console.log(result)
      } catch (err) {
        console.log(err)
      }
    }

    if (!user.id) {
      history.push('/')
    } else {
      init()
    }
  }, [])

  return (
    <div id='credentials'>
      <h1>Credentials</h1>
    </div>
  )
}

export default Credentials
