

const initialPenaltiesState = {
  penalties: [[10,12],[40,50]]
}

export default PenaltiesReducer = (state = initialPenaltiesState, action = {}) => {
  switch (action.type) {
    case 'CHOOSE_STYLE': {
      newState = JSON.parse(JSON.stringify(state))
      return newState
    }
    default: 
      return state
  }
}