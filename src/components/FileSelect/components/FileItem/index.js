import React from 'react'
import './file-item.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const FileItem = props => {
  const { file, onClick, selected } = props

  const handleClick = e => {
    e.preventDefault()
    onClick(file)
  }

  const handleDelete = e => {
    e.preventDefault()
    console.log(file)
  }

  return (
    <li className={selected ? 'file-item selected' : 'file-item'} onClick={handleClick}>
      <h4 className='file-name'>{file}</h4>
      <div title='Delete' className='icon-container alert' tabIndex='1' onClick={handleDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </div>
    </li>
  )
}

export default FileItem
