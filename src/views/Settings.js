import React, { useState } from 'react'
import Toolbar from '../components/Toolbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useRegexBuilder } from '../hooks/password'
import { useDialog, useIpcRenderer } from '../hooks/electron'
import { useSaveSettings, useSave, useReset } from '../hooks/helpers'
import SettingsExpand from '../components/settings/SettingsExpand'
import SettingsCheckbox from '../components/settings/SettingsCheckbox'
import SettingsText from '../components/settings/SettingsText'
import SettingsNumber from '../components/settings/SettingsNumber'
import SettingsButton from '../components/settings/SettingsButton'
import SettingsInfo from '../components/settings/SettingsInfo'

const Settings = props => {
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState({ password: '', confirm: '' })
  const history = useHistory()
  const handleSave = useSave()
  const buildRegex = useRegexBuilder()
  const dispatch = useDispatch()
  const saveSettings = useSaveSettings()
  const setHash = useIpcRenderer('hash')
  const saveAs = useIpcRenderer('saveas')
  const deleteFile = useIpcRenderer('delete')
  const confirm = useDialog()
  const reset = useReset()
  const { options, credentials, config, unsaved } = useSelector(state => {
    return {
      options: state.options,
      credentials: state.credentials.present,
      config: state.config,
      unsaved: state.credentials.unsaved
    }
  })

  /**
   * Handles change event for checkmarks
   * @param {object} e
   */
  const handleCheckChange = e => {
    dispatch({
      type: 'UPDATE_OPTION',
      option: e.target.name,
      value: e.target.checked
    })
  }

  /**
   * Handles change event for text input
   * @param {object} e
   */
  const handleTextChange = e => {
    dispatch({
      type: 'UPDATE_OPTION',
      option: e.target.name,
      value: e.target.value
    })
  }

  /**
   * Handles change event for number inputs
   * @param {object} e
   */
  const handleNumberChange = e => {
    const min = parseInt(e.target.min)
    const max = parseInt(e.target.max)
    const value = parseInt(e.target.value)
    let newValue

    // Enforces min/max if set
    newValue = max < value ? max : value
    newValue = min > newValue ? min : newValue

    dispatch({
      type: 'UPDATE_OPTION',
      option: e.target.name,
      value: newValue
    })
  }

  /**
   * Handles regex field changes
   * @param {object} e
   */
  const handleRegexChange = e => {
    const { name, type } = e.target
    const value = type === 'checkbox' ? e.target.checked : e.target.value
    const newParams = { ...options.generateParams, [name]: value }

    if (!Object.values(newParams).includes(true)) return

    // Finalize the changes
    dispatch({ type: 'UPDATE_OPTION', option: 'generateParams', value: newParams })
    const regex = buildRegex(newParams)
    dispatch({ type: 'UPDATE_OPTION', option: 'passwordPattern', value: regex })
  }

  /**
   * Handles new file event
   * @param {object}
   */
  const handleNewFile = async () => {
    setLoading(true)
    await reset()
    setLoading(false)

    history.push('/')
  }

  /**
   * Handles restore event
   * @param {object} e
   */
  const handleRestore = async e => {
    const result = await confirm('Restoring default settings cannot be undone. Are you sure you want to do this?', 'warning')
    if (result === 1) return

    dispatch({ type: 'RESET_OPTIONS' })
  }

  /**
   * Handles going back
   * @param {object} e
   */
  const handleBack = e => {
    saveSettings()
    history.goBack()
  }

  /**
   * Handles setting the New Password
   * @param {object} e
   */
  const handleNewPassword = e => {
    setNewPassword({ ...newPassword, [e.target.name]: e.target.value })
  }

  /**
   * Handles the Save As event
   * @param {object} e
   */
  const handleSaveAs = async e => {
    setLoading(true)
    if (unsaved) {
      const result = await confirm('You have unsaved changes to your file. Do you want to save before continuing?', 'question', ['Yes', 'No'])

      if (result !== 1) {
        await handleSave()
      }
    }

    const { password } = newPassword
    if (!password || password !== newPassword.confirm) {
      setLoading(false)
      return
    }

    const [success, hash] = await setHash(password)
    if (!success) {
      setLoading(false)
      return
    }

    await saveAs({ payload: credentials, key: hash })
    setLoading(false)
  }

  /**
   * Handles the Delete event
   * @param {object} e
   */
  const handleDelete = async e => {
    setLoading(true)
    const result = await confirm('Deleting this file cannot be reversed.', 'warning', ['OK', 'Cancel'])
    if (result === 1) {
      setLoading(false)
      return
    }

    const [success] = await deleteFile(config.file)

    if (success) {
      dispatch({ type: 'UPDATE_CONFIG', config: 'file', value: '' })
      dispatch({ type: 'UPDATE_CONFIG', config: 'rememberFile', value: false })
      await saveSettings({ config: { file: '', rememberFile: false } })
      await reset()
      setLoading(false)
      history.push('/')
    } else {
      setLoading(false)
    }
  }

  /**
   * Formats the file name
   * @return {string}
   */
  const formatFileName = () => {
    if (!config.file) {
      return 'File Not Found'
    }

    return config.file.split('\\').slice(-1).pop()
  }

  return (
    <div>
      <Toolbar settingsPage clickCallback={handleBack} />
      <main id='settings'>
        <div className='header-container'>
          <div className='back-container' onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <h1>Settings</h1>
        </div>
        <h2 className='settings-list-title'>General</h2>
        <ul className='settings-list'>
          {config.loaded ? (
            <li>
              <SettingsInfo
                title='Current File'
                value={formatFileName()}
              />
            </li>
          ) : ''}
          <li>
            <SettingsCheckbox
              title='Allow showing passwords'
              name='passwordShow'
              value={options.passwordShow}
              onChange={handleCheckChange}
            />
          </li>
          <li>
            <SettingsCheckbox
              title='Hide usernames'
              name='usernameHide'
              value={options.usernameHide}
              onChange={handleCheckChange}
            />
          </li>
        </ul>
        <h2 className='settings-list-title'>Password Generation</h2>
        <ul className='settings-list'>
          <li>
            <SettingsNumber
              title='Password Length'
              min={1}
              max={2048}
              name='passwordLength'
              value={options.passwordLength}
              onChange={handleNumberChange}
            />
          </li>
          <li>
            <SettingsCheckbox
              title='Use Lowercase Characters'
              name='useLower'
              value={options.generateParams.useLower}
              onChange={handleRegexChange}
              description='a b c d e'
            />
          </li>
          <li>
            <SettingsCheckbox
              title='Use Uppercase Characters'
              name='useUpper'
              value={options.generateParams.useUpper}
              onChange={handleRegexChange}
              description='A B C D E'
            />
          </li>
          <li>
            <SettingsCheckbox
              title='Use Numbers'
              name='useNumbers'
              value={options.generateParams.useNumbers}
              onChange={handleRegexChange}
              description='0 1 2 3 4'
            />
          </li>
          <li>
            <SettingsCheckbox
              title='Use Symbols'
              name='useSymbols'
              value={options.generateParams.useSymbols}
              onChange={handleRegexChange}
              description='@ # $ % + ? ! & * |'
            />
          </li>
          <li>
            <SettingsCheckbox
              title='Use Special Characters'
              name='useSpecial'
              value={options.generateParams.useSpecial}
              onChange={handleRegexChange}
              description={'< > { } [ ] ( ) / \\ \' " ` ~ , ; : . < > - _ ^'}
            />
          </li>
          <li>
            <SettingsExpand>
              <SettingsText
                title='Generator Character Regex'
                name='passwordPattern'
                value={options.passwordPattern}
                onChange={handleTextChange}
                description='Adjusting this can cause MAJOR issues with app if not entered correctly.'
                placeholder='Regex'
                danger
              />
            </SettingsExpand>
          </li>
        </ul>
        <h2 className='settings-list-title'>Other</h2>
        <ul className='settings-list'>
          {config.loaded ? (
            <li>
              <SettingsButton
                value={loading ? 'Loading...' : 'Load New File'}
                onClick={handleNewFile}
              />
            </li>
          ) : ''}
          {config.loaded && credentials.length ? (
            <li>
              <SettingsExpand title='Save As'>
                <SettingsText
                  title='New Password'
                  name='password'
                  value={newPassword.password}
                  onChange={handleNewPassword}
                  description='Do not use the same password for different files.'
                  placeholder='New Password'
                  password
                />
                <SettingsText
                  title='Confirm New Password'
                  name='confirm'
                  value={newPassword.confirm}
                  onChange={handleNewPassword}
                  description={newPassword.password !== newPassword.confirm ? 'Passwords do not match.' : ''}
                  password
                  danger
                />
                <SettingsButton
                  value={loading ? 'Loading...' : 'Create File'}
                  onClick={handleSaveAs}
                />
              </SettingsExpand>
            </li>
          ) : ''}
          {config.loaded && config.file ? (
            <li>
              <SettingsButton
                value={loading ? 'Loading...' : 'Delete File'}
                onClick={handleDelete}
                danger
              />
            </li>
          ) : ''}
          <li>
            <SettingsExpand>
              <SettingsInfo
                title='Version'
                value='v0.1.0'
              />
              <SettingsButton
                value='Restore Default Settings'
                onClick={handleRestore}
                danger
              />
            </SettingsExpand>
          </li>
        </ul>
      </main>
    </div>
  )
}

export default Settings
