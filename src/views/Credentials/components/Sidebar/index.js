import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import NewFile from './components/NewFile'
import './sidebar.scss'

const Sidebar = () => {
  const [newFile, setNewFile] = useState(false)
  const [selected, files] = useSelector(state => [
    state.fileList.selected.name, state.fileList.files
  ])

  const handleClick = file => {
    if (file === selected) return

    console.log(file)
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
