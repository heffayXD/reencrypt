import { useSelector, useDispatch } from 'react-redux'
import { useIpcRenderer } from './electron'
import { updateFile } from '../helpers/api'

/**
 * Saves settings to file
 * @return {function}
 */
export const useSaveSettings = () => {
  const handleSave = useIpcRenderer('savesettings')
  const { config, options } = useSelector(state => {
    return { config: state.config, options: state.options }
  })

  return async (override = {}) => {
    const { file, rememberFile, username } = config

    const result = await handleSave({
      options: options,
      config: {
        file: rememberFile ? file : '',
        rememberFile,
        username
      },
      ...override
    })

    return result
  }
}

/**
 * Saves credentials to file
 * @return {function}
 */
export const useSave = () => {
  const onSave = useIpcRenderer('save')
  const dispatch = useDispatch()
  const { credentials, config } = useSelector(state => {
    return {
      credentials: state.credentials.present,
      config: state.config
    }
  })

  return async () => {
    const [success] = await onSave({
      payload: credentials,
      file: config.file,
      key: config.key
    })

    if (success) {
      dispatch({ type: 'RESET_UNSAVED' })
    }
  }
}

/**
 * Saves credentials online
 * @return {function}
 */
export const useSync = () => {
  const encrypt = useIpcRenderer('encrypt')
  const dispatch = useDispatch()
  const { credentials, config } = useSelector(state => {
    return {
      credentials: state.credentials.present,
      config: state.config
    }
  })

  return async (url) => {
    try {
      const [encrypted, data] = await encrypt({ payload: credentials, key: config.key })
      if (!encrypted) throw data

      const [success, result] = await updateFile(url, config.file, { data, name: config.file })
      if (!success) throw result

      console.log(success, result)
      dispatch({ type: 'RESET_UNSAVED' })
    } catch (err) {
      console.log(err)
    }
  }
}

/**
 * Resets all configurations
 * @return {function}
 */
export const useReset = () => {
  const dispatch = useDispatch()

  return async () => {
    dispatch({ type: 'RESET_CREDENTIALS' })
    dispatch({ type: 'RESET_UNDO' })
    dispatch({ type: 'RESET_CONFIG' })
  }
}

/**
 * Focuses an element and selects
 * @param {string} id
 * @param {boolean} select
 * @return {function}
 */
export const useFocus = (id, select = false) => {
  return () => {
    setTimeout(() => {
      const el = document.getElementById(id)
      el.focus()
      if (select) {
        el.select()
      }
    })
  }
}
