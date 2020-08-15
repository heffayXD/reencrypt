import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Toolbar from '../components/Toolbar'
import { signIn, setToken } from '../helpers/api'

const SignIn = props => {
  const [url] = useState('http://localhost:8086/api')
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const history = useHistory()
  const dispatch = useDispatch()

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

      setLoading(false)
      history.push('/account-files')
    } catch (err) {
      handleError(err)
    }
  }

  return (
    <div>
      <Toolbar />
      <main id='load-file'>
        <form onSubmit={handleSignIn}>

          <div className='enter-password'>
            <h3>Sign In</h3>
            <div>
              <input
                type='text'
                value={credentials.username}
                placeholder='Username'
                name='username'
                onChange={handleCredentials}
              />
            </div>
            <div>
              <input
                type='password'
                value={credentials.password}
                placeholder='Password'
                name='password'
                onChange={handleCredentials}
              />
            </div>
            <div className='remember'>
              <label className='checkmark-container' tabIndex='0'>
                <input type='checkbox' name='rememberFile' checked={remember} onChange={handleRemember} />
                <span className='checkmark'>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                Remember
              </label>
            </div>
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
