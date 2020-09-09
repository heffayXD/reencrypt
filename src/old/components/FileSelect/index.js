import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './file-select.scss'

import FileItem from './components/FileItem'

import { getFile } from '../../helpers/api'

const FileSelect = props => {
  const { handleModal } = props
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { files, selected } = useSelector(state => {
    console.log(state.fileList)
    return state.fileList
  })

  const handleClick = async file => {
    try {
      if (loading) return
      setLoading(true)

      const [success, result] = await getFile('http://localhost:8086/api', file)
      if (!success) throw result

      dispatch({ type: 'SET_SELECTED', selected: { name: file, data: result } })
      dispatch({ type: 'UPDATE_CONFIG', config: 'file', value: file })
      dispatch({ type: 'UPDATE_CONFIG', config: 'key', value: '' })
      dispatch({ type: 'RESET_CREDENTIALS' })

      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  return (
    <ul id='file-select'>
      {files.map(file => (
        <FileItem
          key={`file-${file}`}
          file={file}
          onClick={handleClick}
          selected={file === selected.name}
        />
      ))}
      <li className='file-item' onClick={handleModal}>
        <h4>+</h4>
      </li>
    </ul>
  )
}

export default FileSelect
