import React, { useState } from 'react'
import './login.scss'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })

  const handleSubmit = async e => {
    try {
      e.preventDefault()
    } catch (err) {
      console.log(err)
    }
  }

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
