import React from 'react'

import FileItem from './FileItem'

const FileSelect = props => {
  const { files } = props

  const handleClick = fileName => {
    console.log(fileName)
  }

  return (
    <ul id='file-select'>
      {files.map(file => (
        <FileItem
          key={`file-${file}`}
          file={file}
          onClick={handleClick}
        />
      ))}
    </ul>
  )
}

export default FileSelect
