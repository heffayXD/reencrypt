import { ipcRenderer, clipboard, remote } from 'electron'

/**
 * Hook for using the IPC Renderer
 * @param {string} eventName
 * @return {function}
 */
export const useIpcRenderer = (eventName) => {
  return args => {
    return new Promise(resolve => {
      ipcRenderer.send(`${eventName}-message`, args)
      ipcRenderer.on(`${eventName}-reply`, (event, result) => {
        resolve(result)
      })
    })
  }
}

/**
 * Hook for using the clipboard
 * @return {function}
 */
export const useClipboard = () => {
  return args => {
    clipboard.writeText(args)
  }
}

/**
 * Hook for using the browser window
 * @return {function}
 */
export const useBrowserWindow = () => {
  return (fn) => {
    const currentWindow = remote.BrowserWindow.getFocusedWindow()

    currentWindow[fn]()
  }
}

/**
 * Hook for using the dialog to confirm
 * @return {function}
 */
export const useDialog = () => {
  return async (message, type = 'question', buttons = ['Yes', 'Cancel']) => {
    const result = await remote.dialog.showMessageBox(remote.BrowserWindow.getFocusedWindow(), {
      type, buttons, message, defaultId: 0, title: 're:Encrypt'
    })

    return result.response
  }
}
