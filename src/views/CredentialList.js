import React, { useState } from 'react'
import Toolbar from '../components/Toolbar'
import InputList from '../components/InputList'
import FloatingMenu from '../components/FloatingMenu'
import { useDispatch, useSelector } from 'react-redux'
import { useFocus, useSave } from '../hooks/helpers'

const CredentialList = props => {
  const [keys, setKeys] = useState([])
  const dispatch = useDispatch()
  const focusSearch = useFocus('search', true)
  const handleSave = useSave()
  const { credentials, searchEnabled } = useSelector(state => {
    return {
      credentials: state.credentials,
      searchEnabled: state.search.enabled
    }
  })

  /**
   * Checks to see if requirements are set for undo or redo
   * @param {object} e
   */
  const checkUndoRedo = (keyArray, e) => {
    if (keyArray.includes(17) && keyArray.includes(90)) {
      e.preventDefault()
      dispatch({ type: 'UNDO' })
    } else if (keyArray.includes(17) && keyArray.includes(89)) {
      e.preventDefault()
      dispatch({ type: 'REDO' })
    } else if (keyArray.includes(17) && keyArray.includes(83) && credentials.unsaved) {
      e.preventDefault()
      handleSave()
    } else if (keyArray.includes(17) && keyArray.includes(70)) {
      if (!searchEnabled) {
        dispatch({ type: 'ENABLE_SEARCH', enabled: true })
      }

      focusSearch()
    }
  }

  /**
   * Handles key up event, watches for redo/undo
   * @param {object} e
   */
  const handleKeyDown = e => {
    if (e.keyCode === 27) {
      if (!searchEnabled) return

      dispatch({ type: 'ENABLE_SEARCH', enabled: false })
    } else if (e.keyCode !== 27 && keys.length < 2 && !keys.includes(e.keyCode)) {
      setKeys([...keys, e.keyCode])
      checkUndoRedo([...keys, e.keyCode], e)
    } else if (keys.length === 2) {
      checkUndoRedo(keys, e)
    }
  }

  /**
   * Handles key up event, watches for redo/undo
   * @param {object} e
   */
  const handleKeyUp = e => {
    setKeys(keys.filter(val => val !== e.keyCode))
  }

  return (
    <div>
      <Toolbar />
      <main id='credentials-list' onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex='2'>
        <InputList />
        <FloatingMenu />
      </main>
    </div>
  )
}

export default CredentialList
