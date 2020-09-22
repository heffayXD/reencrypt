const DEFAULT_STATE = {
  id: '',
  firstName: '',
  lastName: '',
  picture: '',
  email: ''
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return { ...action.user }
    case 'RESET_USER':
      return { ...DEFAULT_STATE }
    default:
      return { ...state }
  }
}
