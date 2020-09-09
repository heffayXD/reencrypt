const DEFAULT_STATE = {
  enabled: false,
  value: ''
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_SEARCH':
      return { ...state, value: action.value }
    case 'ENABLE_SEARCH':
      return { ...state, enabled: action.enabled }
    case 'SET_SEARCH':
      return { ...state, ...action.search }
    case 'RESET_SEARCH':
      return { ...DEFAULT_STATE }
    default:
      return { ...state }
  }
}
