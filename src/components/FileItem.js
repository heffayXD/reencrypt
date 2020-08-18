import React from 'react'

const FileItem = props => {
  const { file, onClick } = props

  const handleClick = e => {
    e.preventDefault()

    onClick(file)
  }

  return (
    <li className='file-item' onClick={handleClick}>
      <h4 className='file-name'>{file}</h4>
    </li>
  )
}

export default FileItem
