import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import './credentials.scss'

// import { useAPI, setToken } from '../../hooks/api'

const Credentials = () => {
  const state = useSelector(state => state)
  console.log(state)

  return (
    <div id='credentials'>
      <h1>Credentials</h1>
    </div>
  )
}

export default Credentials
