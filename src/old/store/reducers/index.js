import { combineReducers } from 'redux'
import undoable from '../enhancers/undoable'
import credentials from './credentials'
import options from './options'
import config from './config'
import search from './search'
import fileList from './fileList'
import user from './user'

const appReducer = combineReducers({
  credentials: undoable(credentials),
  options,
  config,
  search,
  fileList,
  user
})

const rootReducer = (state, action) => {
  if (action.type === 'REMOVE_ALL') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
