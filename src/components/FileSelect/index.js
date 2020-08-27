import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './file-select.scss'

import FileItem from './components/FileItem'

import { getFile } from '../../helpers/api'

const FileSelect = props => {
  const { handleModal } = props
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { files, selected } = useSelector(state => state.fileList)

  const handleClick = async fileName => {
    try {
      if (loading) return
      setLoading(true)

      const [success, result] = await getFile('http://localhost:8086/api', fileName)
      if (!success) throw result

      props.reset()
      props.setData(result)

      dispatch({ type: 'SET_SELECTED', selected: fileName })
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
      <li className='file-item' onClick={handleModal}>
        <h4>+</h4>
      </li>
    </ul>
  )
}

export default FileSelect
