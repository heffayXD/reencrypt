const DEFAULT_STATE = {
  file: '',
  key: '',
  rememberFile: false,
  loaded: false,
  url: 'http://localhost:8086/api',
  offline: true
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_CONFIG':
      return { ...state, [action.config]: action.value }
    case 'RESET_CONFIG':
      return { ...DEFAULT_STATE }
    case 'SET_CONFIG':
      return { ...state, ...action.config }
    default:
      return { ...state }
  }
}
