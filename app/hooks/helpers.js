import path from 'path'
import fs from 'fs'

export const useAppPath = (app, file = '') => {
  const appPath = path.join(app.getPath('documents'), `reEncrypt${file ? `/${file}` : ''}`)

  const checkAppFolder = () => {
    return new Promise((resolve, reject) => {
      try {
        fs.stat(appPath, async (err) => {
          try {
            if (err) throw err

            resolve(true)
          } catch (err) {
            resolve(false)
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  const createDir = () => {
    return new Promise((resolve, reject) => {
      try {
        fs.mkdir(appPath, { recursive: true }, async (err) => {
          try {
            if (err) throw err

            resolve(true)
          } catch (err) {
            reject(err)
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  return async () => {
    try {
      const folderExists = await checkAppFolder()

      if (!folderExists) {
        const dirCreated = await createDir()

        if (!dirCreated) throw new Error('Could not create folder')

        return [true, appPath]
      } else {
        return [true, appPath]
      }
    } catch (err) {
      return [false, err.message]
    }
  }
}

export const isDev = () => {
  return process.env.NODE_ENV === 'development'
}
