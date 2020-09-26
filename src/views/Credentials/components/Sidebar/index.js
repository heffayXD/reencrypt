import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import './sidebar.scss'

import { useAPI } from '../../../../hooks/api'
import NewFile from './components/NewFile'

const Sidebar = () => {
  const getFile = useAPI('/file/:fileId', 'get')
  const [newFile, setNewFile] = useState(false)
  const dispatch = useDispatch()
  const [selected, files] = useSelector(state => [
    state.fileList.selected.name, state.fileList.files
  ])

  const handleClick = async file => {
    try {
      if (file === selected) return

      const [fileSuccess, data] = await getFile({}, { fileId: file })
      if (!fileSuccess) throw data

      dispatch({ type: 'SET_SELECTED', selected: { name: file, data } })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div id='sidebar'>
      <ul id='file-list'>
        {files.map((file, index) => (
          <li
            className={file === selected && !newFile ? 'selected' : ''}
            onClick={e => { handleClick(file) }}
            key={`file-${index}`}
          >
            {file}
          </li>
        ))}
        <NewFile newFile={newFile} setNewFile={setNewFile} />
      </ul>
    </div>
  )
}

export default Sidebar
