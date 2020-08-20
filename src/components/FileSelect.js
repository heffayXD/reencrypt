import React, { useState } from 'react'

import FileItem from './FileItem'

import { getFile } from '../helpers/api'

const FileSelect = props => {
  const { files } = props
  const [loading, setLoading] = useState(false)

  const handleClick = async fileName => {
    try {
      if (loading) return
      setLoading(true)

      const [success, result] = await getFile('http://localhost:8086/api', fileName)
      if (!success) throw result

      props.setPassword('')
      props.setData(result)
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
        />
      ))}
    </ul>
  )
}

export default FileSelect
