import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Toolbar from '../components/Toolbar'
import TextInput from '../components/onboarding/TextInput'
import Checkbox from '../components/onboarding/Checkbox'
import { signIn, setToken } from '../helpers/api'

const SignIn = props => {
  const [url] = useState('http://localhost:8086/api')
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    const tempFunc = async () => {
      try {
        setLoading(true)

        const userData = await signIn(url, { username: 'heffayXD', password: 'Password123' })
        if (!userData.token) throw userData
        setToken(userData.token)

        const username = remember ? credentials.username : ''
        dispatch({ type: 'UPDATE_CONFIG', config: 'username', value: username })
        dispatch({ type: 'UPDATE_CONFIG', config: 'offline', value: false })

        setLoading(false)
        history.push('/online-list')
      } catch (err) {
        handleError(err)
      }
    }

    tempFunc()
  }, [])

  /**
   * Handles setting an error
   * @param {string} error
   */
  const handleError = error => {
    setError(error)
    setLoading(false)
  }

  const handleRemember = e => {
    setRemember(!remember)
  }

  /**
   * Handles setting password value
   * @param {object} e
   */
  const handleCredentials = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  /**
   * Handles submission of the form
   * @param {object} e
   */
  const handleSignIn = async e => {
    try {
      // Reset defaults
      e.preventDefault()
      if (loading) return
      if (error) setError('')
      setLoading(true)

      const userData = await signIn(url, credentials)
      if (!userData.token) throw userData
      setToken(userData.token)

      const username = remember ? credentials.username : ''
      dispatch({ type: 'UPDATE_CONFIG', config: 'username', value: username })
      dispatch({ type: 'UPDATE_CONFIG', config: 'offline', value: false })

      setLoading(false)
      history.push('/online-list')
    } catch (err) {
      handleError(err)
    }
  }

  return (
    <div>
      <Toolbar />
      <main id='load-file'>
        <form onSubmit={handleSignIn}>

          <div>
            <h3>Sign In</h3>
            <TextInput
              value={credentials.username}
              placeholder='Username'
              name='username'
              onChange={handleCredentials}
            />
            <TextInput
              type='password'
              value={credentials.password}
              placeholder='Password'
              name='password'
              onChange={handleCredentials}
            />
            <Checkbox
              checked={remember}
              text='Remember Username'
              name='remember'
              onChange={handleRemember}
            />
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
            <p className='button' onClick={() => history.push('/')}>or Load File</p>
          </div>

        </form>
      </main>
    </div>
  )
}

export default SignIn
