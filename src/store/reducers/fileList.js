const DEFAULT_STATE = {
  selected: {
    name: '',
    data: ''
  },
  files: []
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'REMOVE_FILE':
      return { ...state, files: state.files.filter(file => file !== action.file) }
    case 'ADD_FILE':
      return { ...state, files: [...state.files, action.file] }
    case 'SET_FILES':
      return { ...state, files: action.files }
    case 'SET_SELECTED':
      return { ...state, selected: { ...action.selected } }
    case 'RESET_FILES':
      return { ...DEFAULT_STATE }
    default:
      return { ...state }
  }
}
