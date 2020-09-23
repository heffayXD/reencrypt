const DEFAULT_STATE = {
  id: '',
  username: '',
  firstName: '',
  lastName: '',
  picture: '',
  email: ''
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...action.user }
    case 'RESET_USER':
      return { ...DEFAULT_STATE }
    default:
      return state
  }
}
