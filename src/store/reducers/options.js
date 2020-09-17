const DEFAULT_STATE = {
  passwordShow: false,
  usernameHide: false,
  generateParams: {
    useLower: true,
    useUpper: true,
    useNumbers: true,
    useSymbols: true,
    useSpecial: false,
    useSimilar: false
  },
  passwordLength: 16,
  passwordPattern: '[a-zA-Z0-9@#$%+?!&*|]',
  username: ''
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_OPTION':
      return { ...state, [action.option]: action.value }
    case 'RESET_OPTIONS':
      return { ...DEFAULT_STATE }
    case 'SET_OPTIONS':
      return { ...state, ...action.options }
    default:
      return { ...state }
  }
}
