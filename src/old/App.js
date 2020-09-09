import React, { useEffect } from 'react'
import Navigation from './components/Navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useIpcRenderer } from './hooks/electron'

const App = () => {
  const dispatch = useDispatch()
  const loaded = useSelector(state => state.config.loaded)
  const loadSettings = useIpcRenderer('loadsettings')

  const onSettings = async () => {
    const [success, result] = await loadSettings()

    if (success && result) {
      dispatch({ type: 'SET_OPTIONS', options: result.options })
      dispatch({ type: 'SET_CONFIG', config: result.config })
    }
  }

  useEffect(() => {
    if (!loaded) {
      onSettings()
    }
  }, [loaded])

  return (
    <div id='app'>
      <Navigation />
    </div>
  )
}

export default App
