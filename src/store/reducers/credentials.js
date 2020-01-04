const DEFAULT_STATE = []

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'ADD_CREDENTIALS': {
      const reducer = (acc, val) => acc < val.id ? val.id : acc
      const id = state.reduce(reducer, 0) + 1
      return [...state, { ...action.credentials, id }]
    }
    case 'DELETE_CREDENTIALS':
      return state.filter(val => val.id !== action.id)
    case 'UPDATE_CREDENTIALS':
      return state.map(val => val.id === action.credentials.id ? action.credentials : val)
    case 'SET_CREDENTIALS':
      return [...action.credentials]
    case 'RESET_CREDENTIALS':
      return [...DEFAULT_STATE]
    default:
      return [...state]
  }
}
