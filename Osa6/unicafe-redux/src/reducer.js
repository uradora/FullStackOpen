const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      var newState = { ...state,
        good: state.good + 1
      }
      return newState
    case 'OK':
      newState = { ...state,
        ok: state.ok + 1
      }
      return newState
    case 'BAD':
      newState = { ...state,
        bad: state.bad + 1
      }
      return newState
    case 'ZERO':
      newState = {
        good: 0,
        ok: 0,
        bad: 0
      }
      return newState
    default: return state
  }
  
}

export default counterReducer