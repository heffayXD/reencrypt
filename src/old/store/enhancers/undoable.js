const undoable = (reducer) => {
  const DEFAULT_STATE = {
    past: [],
    present: reducer(undefined, {}),
    future: [],
    unsaved: false
  }

  // Return a reducer that handles undo and redo
  return (state = DEFAULT_STATE, action) => {
    const { past, present, future, unsaved } = state

    switch (action.type) {
      case 'UNDO': {
        if (!past.length) {
          return Object.assign({}, state)
        }

        return {
          past: past.slice(0, past.length - 1),
          present: past[past.length - 1],
          future: [present, ...future],
          unsaved: !unsaved && present.length ? true : unsaved
        }
      }
      case 'REDO': {
        if (!future.length) {
          return Object.assign({}, state)
        }

        return {
          past: [...past, present],
          present: future[0],
          future: future.slice(1),
          unsaved: !unsaved && present.length ? true : unsaved
        }
      }
      case 'RESET_UNDO':
        return Object.assign({}, DEFAULT_STATE)
      case 'RESET_UNSAVED':
        return Object.assign({}, { ...state, unsaved: false })
      default: {
        // Delegate handling the action to the passed reducer
        const newPresent = reducer(present, action)
        if (JSON.stringify(newPresent) === JSON.stringify(present)) {
          return state
        }

        const newPast = present.length === 0 ? past : [...past, present]

        return {
          past: newPast,
          present: newPresent,
          future: [],
          unsaved: !unsaved && present.length ? true : unsaved
        }
      }
    }
  }
}

export default undoable
