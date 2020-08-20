import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import FileItem from './FileItem'

import { getFile } from '../helpers/api'

const FileSelect = props => {
  const { files, handleModal } = props
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

  return (
    <ul id='file-select'>
      {files.map(file => (
        <FileItem
          key={`file-${file}`}
          file={file}
          onClick={handleClick}
          selected={file === selected}
        />
      ))}
      <li className='file-item' onClick={handleModal}>+</li>
    </ul>
  )
}

export default FileSelect
