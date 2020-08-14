import 'regenerator-runtime'
import path from 'path'
import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import { app, BrowserWindow, ipcMain } from 'electron'
import { onHash, onFile, onSave, onLoad, onSaveAs, onSaveSettings, onLoadSettings, onDelete } from './ipc/ipcCallbacks'
import { isDev } from './hooks/helpers'

let mainWindow = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    minWidth: 550,
    minHeight: 310,
    webPreferences: { nodeIntegration: true }
  })

  if (isDev()) {
    installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err))

    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

// Mac fix
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

ipcMain.on('file-message', (event, params) => onFile(app, event, params))
ipcMain.on('hash-message', (event, params) => onHash(app, event, params))
ipcMain.on('save-message', (event, params) => onSave(app, event, params))
ipcMain.on('load-message', (event, params) => onLoad(app, event, params))
ipcMain.on('saveas-message', (event, params) => onSaveAs(app, event, params))
ipcMain.on('savesettings-message', (event, params) => onSaveSettings(app, event, params))
ipcMain.on('loadsettings-message', (event, params) => onLoadSettings(app, event, params))
ipcMain.on('delete-message', (event, params) => onDelete(app, event, params))
