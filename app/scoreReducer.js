const initialScoreState = {
  scores: [0,0],
  goals: [[],[]],
  snitches: [[],[]]
}

export default ScoreReducer = (state = initialScoreState, action = {}) => {
  switch (action.type) {
    case 'ADD_GOAL': {
      // Adding a goal just means increasing the score and pushing the goal data into the store
      newState = JSON.parse(JSON.stringify(state))
      newState.goals[action.teamIndex].push({timeInMilliseconds: action.timeInMilliseconds, scorerNumber: action.scorerNumber})
      newState.scores[action.teamIndex] += 10
      return newState
    }
    case 'EDIT_GOAL': {
      // To edit a goal, check it exists
      newState = JSON.parse(JSON.stringify(state))
      if(action.teamIndex == null || action.goalIndex == null) return newState

      // Get the old goal info
      oldGoal = newState.goals[action.teamIndex][action.goalIndex]

      // Build the new result
      result = {timeInMilliseconds: action.timeInMilliseconds, scorerNumber: action.scorerNumber}

      // In case the edit action was passed incorrectly, overwrite nulls with the old values
      if(action.timeInMilliseconds == null) {
        result.timeInMilliseconds = oldGoal.timeInMilliseconds
      }
      if(action.scorerNumber == null) {
        result.scorerNumber = oldGoal.scorerNumber
      }

      // Add the newly edited goal into the state
      newState.goals[action.teamIndex][action.goalIndex] = result
      return newState

    }
    case 'REMOVE_GOAL': {
      // Sanity check for bad actions
      if(action.goalIndex == -1) {
        return state;
      }
      newState = JSON.parse(JSON.stringify(state))
      // Cut it out, and reduce the score
      newState.goals[action.teamIndex].splice(action.goalIndex, 1)
      newState.scores[action.teamIndex] -= 10
      return newState
    }
    case 'ADD_SNITCH': {
      newState =  JSON.parse(JSON.stringify(state))
      newState.snitches[action.teamIndex].push({timeInMilliseconds: action.timeInMilliseconds, scorerNumber: action.catcherNumber})
      newState.scores[action.teamIndex] += 30
      return newState
    }
    case 'REMOVE_SNITCH': {
      if(action.snitchIndex == -1) {
        return state;
      }
      newState =  JSON.parse(JSON.stringify(state))
      newState.snitches[action.teamIndex].splice(action.snitchIndex, 1)
      newState.scores[action.teamIndex] -= 30
      return newState
    }
    default: 
      return state
  }
}