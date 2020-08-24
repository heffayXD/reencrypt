import React, { useState } from 'react'
import './list-item.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCopy, faEye, faEyeSlash, faCogs } from '@fortawesome/free-solid-svg-icons'

import { useClipboard, useDialog } from '../../../../hooks/electron'
import { useGenerate } from '../../../../hooks/password'
import { useSelector } from 'react-redux'

const ListItem = props => {
  const copyToClipboard = useClipboard()
  const confirm = useDialog()
  const [show, setShow] = useState({ password: false, username: false })
  const generatePassword = useGenerate()
  const options = useSelector(state => state.options)
  const { id, title, username, password } = props.credentials

  /**
   * Handles credentials change
   * @param {object} e
   */
  const handleChange = e => {
    props.setCredentials({
      ...props.credentials,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Handles deleting an item
   */
  const handleDelete = async () => {
    if (!title) {
      props.handleDelete(id)
    } else {
      const result = await confirm(`Are you sure you want to delete ${title}?`)
      if (result === 1) return

      props.handleDelete(id)
    }
  }

  /**
   * Handles copying an item
   */
  const handleCopy = value => {
    copyToClipboard(value)
  }

  /**
   * Handles generating a password
   */
  const handleGenerate = () => {
    props.setCredentials({
      ...props.credentials,
      password: generatePassword(24)
    })
  }

  /**
   * Handles hiding/showing values
   * @param {boolean} string
   */
  const handleShow = value => {
    setShow({ ...show, [value]: !show[value] })
  }

  return (
    <li className='list-item'>
      <div className='input-container'>
        <input
          className='list-title'
          onChange={handleChange}
          type='text'
          value={title}
          name='title'
          placeholder='Title'
        />
        <div title='Delete' className='icon-container alert' tabIndex='1' onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </div>
      <div className='input-container'>
        <input
          className='list-username'
          onChange={handleChange}
          type={!show.username && options.usernameHide ? 'password' : 'text'}
          value={username}
          name='username'
          placeholder='Username'
        />
        {options.usernameHide ? (
          <div title={show.username ? 'Hide' : 'Show'} className='icon-container' tabIndex='1' onClick={() => { handleShow('username') }}>
            <FontAwesomeIcon icon={show.username ? faEyeSlash : faEye} />
          </div>
        ) : ''}
        <div title='Copy' className='icon-container' tabIndex='1' onClick={() => { handleCopy(username) }}>
          <FontAwesomeIcon icon={faCopy} />
        </div>
      </div>
      <div className='input-container'>
        <input
          className='list-password'
          onChange={handleChange}
          type={show.password ? 'text' : 'password'}
          value={password}
          name='password'
          placeholder='Password'
        />
        {options.passwordShow ? (
          <div title={show.password ? 'Hide' : 'Show'} className='icon-container' tabIndex='1' onClick={() => { handleShow('password') }}>
            <FontAwesomeIcon icon={show.password ? faEyeSlash : faEye} />
          </div>
        ) : ''}
        <div title='Generate' className='icon-container' tabIndex='1' onClick={handleGenerate}>
          <FontAwesomeIcon icon={faCogs} />
        </div>
        <div title='Copy' className='icon-container' tabIndex='1' onClick={() => { handleCopy(password) }}>
          <FontAwesomeIcon icon={faCopy} />
        </div>
      </div>
    </li>
  )
}

export default ListItem
