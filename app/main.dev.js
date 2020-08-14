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

// Sets up the IPC functions
const setUpIPC = () => {
  const ipcFunctions = {
    file: onFile,
    hash: onHash,
    save: onSave,
    load: onLoad,
    saveas: onSaveAs,
    savesettings: onSaveSettings,
    loadsettings: onLoadSettings,
    delete: onDelete
  }

  for (const [key, callback] of Object.entries(ipcFunctions)) {
    ipcMain.on(`${key}-message`, (event, params) => callback(app, event, params))
  }
}
setUpIPC()
