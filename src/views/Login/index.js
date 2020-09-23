import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './login.scss'

import { useAPI, setToken } from '../../hooks/api'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const signIn = useAPI('/user/sign-in', 'post')
  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmit = async e => {
    try {
      e.preventDefault()

      const [success, result] = await signIn(credentials)
      if (!success) throw result

      // Set Token, user, then push to credentials
      setToken(result.token)
      dispatch({ type: 'SET_USER', user: result.user })
      history.push('/credentials')
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const temp = async () => {
      try {
        const [success, result] = await signIn({ username: 'heffayXD', password: 'Password123' })
        if (!success) throw result

        // Set Token, user, then push to credentials
        setToken(result.token)
        dispatch({ type: 'SET_USER', user: result.user })
        history.push('/credentials')
      } catch (err) {
        console.log(err)
      }
    }

    temp()
  }, [])

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div id='login'>
      <form onSubmit={handleSubmit}>
        <div className='input-container'>
          <input
            name='username'
            type='text'
            placeholder='Username'
            value={credentials.username}
            onChange={handleChange}
          />
        </div>
        <div className='input-container'>
          <input
            name='password'
            type='password'
            placeholder='Password'
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <input type='submit' value='Submit' />
      </form>
    </div>
  )
}

export default Login
