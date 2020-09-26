import React, { useState, useRef } from 'react'
import './new-file.scss'

const NewFile = props => {
  const [filename, setFilename] = useState('')
  const { newFile, setNewFile } = props
  const inputRef = useRef(null)

  const handleChange = e => {
    e.preventDefault()

    setFilename(e.target.value)
  }

  const handleFocusOut = e => {
    setNewFile(false)
  }

  const handleNew = e => {
    setNewFile(true)
    setTimeout(() => { inputRef.current.focus() }, 0)
  }

  return (
    <>
      {
        newFile
          ? (
            <li className='new-file'>
              <input
                ref={inputRef}
                type='text'
                onChange={handleChange}
                onBlur={handleFocusOut}
                value={filename}
              />
            </li>
          )
          : (<li onClick={handleNew}>+</li>)
      }
    </>
  )
}

export default NewFile
