import { combineReducers } from 'redux'
import undoable from '../enhancers/undoable'
import credentials from './credentials'
import options from './options'
import config from './config'
import search from './search'

const appReducer = combineReducers({
  credentials: undoable(credentials),
  options,
  config,
  search
})

const rootReducer = (state, action) => {
  if (action.type === 'REMOVE_ALL') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
