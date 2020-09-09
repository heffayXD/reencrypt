import React from 'react'
import { useDispatch } from 'react-redux'
import './file-item.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import { useDialog } from '../../../../hooks/electron'
import { useFileREST } from '../../../../hooks/api'

const FileItem = props => {
  const { file, onClick, selected } = props
  const destroyFile = useFileREST('destroy')
  const dispatch = useDispatch()
  const dialog = useDialog()

  const handleClick = e => {
    e.preventDefault()
    onClick(file)
  }

  const handleDelete = async e => {
    try {
      e.preventDefault()

      const response = await dialog(`Are you sure you want to delete "${file}"?`)

      if (response === 0) {
        const [success, message] = await destroyFile(file)
        if (!success) throw message

        dispatch({ type: 'REMOVE_FILE', file })
        dispatch({ type: 'RESET_SELECTED' })
        dispatch({ type: 'UPDATE_CONFIG', config: 'file', value: '' })
      }
    } catch (err) {
      console.log(err)
    }
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
