const initialTeamState = {
  names: ['Team A', 'Team B']
}

export default TeamReducer = (state = initialTeamState, action = {}) => {
  switch (action.type) {
    case 'SET_NAME': {
      newState = JSON.parse(JSON.stringify(state))
      newState.names[action.teamIndex] = action.newName
      return newState
    }
    default: 
      return state
  }
}