import 'regenerator-runtime'
import fs from 'fs'
import path from 'path'
import { dialog } from 'electron'
import { useEncryptCredentials, useDecryptCredentials, useHashPassword } from '../hooks/encrypt'
import { useAppPath, isDev } from '../hooks/helpers'

/**
 * Handles the On Save IPC Event
 * @param {object} app, @param {object} event, @param {object} config
 */
export const onSave = async (app, event, config) => {
  try {
    const encrypt = useEncryptCredentials()
    const [success, encryptedData] = await encrypt(config.payload, config.key)

    if (!success) throw new Error(`Encryption failed: ${encryptedData}`)

    await fs.writeFile(config.file, encryptedData, (err) => {
      if (err) throw err

      event.reply('save-reply', [true, 'File Saved'])
    })
  } catch (err) {
    event.reply('save-reply', [false, err.message])
  }
}

/**
 * Handles the On Save As IPC Event
 * @param {object} app, @param {object} event, @param {object} config
 */
export const onSaveAs = async (app, event, config) => {
  try {
    const getAppPath = useAppPath(app, isDev() ? 'dev' : 'data')

    const [exists, appPath] = await getAppPath()
    if (!exists) throw new Error(appPath)

    const encrypt = useEncryptCredentials()
    const [success, encryptedData] = await encrypt(config.payload, config.key)

    if (!success) throw new Error(`Encryption failed: ${encryptedData}`)

    const result = await dialog.showSaveDialog({
      defaultPath: path.join(appPath, isDev() ? 'dev.gtfo' : 'data.gtfo'),
      filters: [
        { name: 'Generated Text File Output', extensions: ['gtfo'] },
        { name: 'Any', extensions: ['*'] }
      ]
    })

    if (result.canceled) throw new Error('Save Cancelled')
    if (!result.filePath) throw new Error('File path not set')

    await fs.writeFile(result.filePath, encryptedData, (err) => {
      if (err) throw err

      event.reply('saveas-reply', [true, result.filePath])
    })
  } catch (err) {
    event.reply('saveas-reply', [false, err.message])
  }
}

/**
 * Handles the On Hash event
 * @param {object} app, @param {object} event, @param {string} password
 */
export const onHash = async (app, event, password) => {
  try {
    const hashPassword = useHashPassword()
    const [success, hash] = await hashPassword(password)

    if (!success) throw new Error(`Hash failed: ${hash}`)

    event.reply('hash-reply', [true, hash])
  } catch (err) {
    event.reply('hash-reply', [false, err.message])
  }
}

/**
 * Handles the On File IPC Event
 * @param {object} app, @param {object} event, @param {object} config
 */
export const onFile = async (app, event, file = '') => {
  try {
    const getAppPath = useAppPath(app, isDev() ? 'dev' : 'data')

    const [exists, appPath] = await getAppPath()
    if (!exists) throw new Error(appPath)

    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      defaultPath: file || appPath,
      filters: [
        { name: 'Generated Text File Output', extensions: ['gtfo'] },
        { name: 'Any', extensions: ['*'] }
      ]
    })

    if (result.canceled) throw new Error('Save Cancelled')
    if (!result.filePaths.length) throw new Error('File path not set')

    event.reply('file-reply', [true, result.filePaths[0]])
  } catch (err) {
    event.reply('file-reply', [false, err.message])
  }
}

/**
 * Handles the On Load IPC Event
 * @param {object} app, @param {object} event, @param {object} config
 */
export const onLoad = async (app, event, config) => {
  try {
    await fs.readFile(config.file, { encoding: 'utf8' }, async (err, data) => {
      try {
        if (err) throw err

        const decrypt = useDecryptCredentials()
        const [success, decryptedData] = await decrypt(data, config.key)

        if (!success) throw new Error(`Decryption failed: ${decryptedData}`)

        event.reply('load-reply', [true, decryptedData])
      } catch (err) {
        event.reply('load-reply', [false, err.message])
      }
    })
  } catch (err) {
    event.reply('load-reply', [false, err.message])
  }
}

/**
 * Handles the On Save Settings IPC Event
 * @param {object} app, @param {object} event, @param {object} settings
 */
export const onSaveSettings = async (app, event, settings) => {
  try {
    const getAppPath = useAppPath(app)

    const [exists, appPath] = await getAppPath()
    if (!exists) throw new Error(appPath)

    const file = path.join(appPath, isDev() ? 'dev-settings.json' : 'settings.json')
    const payload = JSON.stringify(settings, null, 1)
    await fs.writeFile(file, payload, (err) => {
      if (err) throw err

      event.reply('savesettings-reply', [true, 'Settings Saved'])
    })
  } catch (err) {
    event.reply('savesettings-reply', [false, err.message])
  }
}

/**
 * Handles the On Load Settings IPC Event
 * @param {object} app, @param {object} event
 */
export const onLoadSettings = async (app, event) => {
  try {
    const getAppPath = useAppPath(app)

    const [exists, appPath] = await getAppPath()
    if (!exists) throw new Error(appPath)

    const file = path.join(appPath, isDev() ? 'dev-settings.json' : 'settings.json')
    await fs.readFile(file, { encoding: 'utf8' }, async (err, data) => {
      try {
        if (err) throw err

        const result = JSON.parse(data)

        event.reply('loadsettings-reply', [true, result])
      } catch (err) {
        event.reply('loadsettings-reply', [false, err.message])
      }
    })
  } catch (err) {
    event.reply('loadsettings-reply', [false, err.message])
  }
}

/**
 * Handles the On Delete IPC Event
 * @param {object} app, @param {object} event, @param {string} file
 */
export const onDelete = async (app, event, file) => {
  try {
    await fs.unlink(file, (err) => {
      if (err) throw err

      event.reply('delete-reply', [true, 'File Deleted'])
    })
  } catch (err) {
    event.reply('delete-reply', [false, err.message])
  }
}

/**
 * Handles the On Encrypt As IPC Event
 * @param {object} app, @param {object} event, @param {object} config
 */
export const onEncrypt = async (app, event, config) => {
  try {
    const encrypt = useEncryptCredentials()
    const [success, encryptedData] = await encrypt(config.payload, config.key)
    if (!success) throw new Error(`Encryption failed: ${encryptedData}`)

    event.reply('encrypt-reply', [true, encryptedData])
  } catch (err) {
    event.reply('encrypt-reply', [false, err.message])
  }
}

/**
 * Handles the On Load IPC Event
 * @param {object} app, @param {object} event, @param {object} config
 */
export const onDecrypt = async (app, event, config) => {
  try {
    try {
      const decrypt = useDecryptCredentials()
      const [success, decryptedData] = await decrypt(config.data, config.key)

      if (!success) throw new Error(`Decryption failed: ${decryptedData}`)

      event.reply('decrypt-reply', [true, decryptedData])
    } catch (err) {
      event.reply('decrypt-reply', [false, err.message])
    }
  } catch (err) {
    event.reply('decrypt-reply', [false, err.message])
  }
}
