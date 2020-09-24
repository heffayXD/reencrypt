import React from 'react'
import { useSelector } from 'react-redux'
import './sidebar.scss'

const Sidebar = () => {
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
            className={file === selected ? 'selected' : ''}
            onClick={e => { handleClick(file) }}
            key={`file-${index}`}
          >
            {file}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
