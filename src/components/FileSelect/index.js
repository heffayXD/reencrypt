import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import './file-select.scss'

import FileItem from './components/FileItem'

import { getFile } from '../../helpers/api'

const FileSelect = props => {
  const { files, setFiles, handleModal } = props
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState('')
  const dispatch = useDispatch()

  const handleClick = async fileName => {
    try {
      if (loading) return
      setLoading(true)

      const [success, result] = await getFile('http://localhost:8086/api', fileName)
      if (!success) throw result

      props.reset()
      props.setData(result)
      setSelected(fileName)
      dispatch({ type: 'UPDATE_CONFIG', config: 'file', value: fileName })
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const handleRemove = fileName => {
    setFiles(files.filter(file => file !== fileName))
  }

  return (
    <ul id='file-select'>
      {files.map(file => (
        <FileItem
          key={`file-${file}`}
          file={file}
          onClick={handleClick}
          onRemove={handleRemove}
          selected={file === selected}
        />
      ))}
      <li className='file-item' onClick={handleModal}>
        <h4>+</h4>
      </li>
    </ul>
  )
}

export default FileSelect
