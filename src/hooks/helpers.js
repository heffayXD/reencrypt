import { useDispatch } from 'react-redux'
import { useAPI } from './api'

export const useInitFiles = () => {
  const getFiles = useAPI('/file', 'get')
  const getFile = useAPI('/file/:fileId', 'get')
  const dispatch = useDispatch()

  return async () => {
    try {
      const [filesSuccess, files] = await getFiles()
      if (!filesSuccess) throw files

      if (files.files.length) {
        const [fileSuccess, file] = await getFile({}, { fileId: files.files[0] })
        if (!fileSuccess) throw file

        dispatch({
          type: 'SET_FILE_LIST',
          fileList: {
            selected: {
              name: files.files[0],
              data: file
            },
            files: files.files
          }
        })

        return [true, file]
      }

      return [true, '']
    } catch (err) {
      return [false, err]
    }
  }
}
