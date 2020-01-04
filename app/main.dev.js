import 'regenerator-runtime'
import path from 'path'
import os from 'os'
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
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (isDev()) {
    BrowserWindow.addDevToolsExtension(
      path.join(os.homedir(), '\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\4.3.0_0')
    )
    BrowserWindow.addDevToolsExtension(
      path.join(os.homedir(), '\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\lmhkpmbekcpmknklioeibfkpmmfibljd\\2.17.0_0')
    )

    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

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
