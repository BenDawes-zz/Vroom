

const initialTimerState = {
  timeInMilliseconds: 0,
  startTime: 0
}

export default TimerReducer = (state = initialTimerState, action = {}) => {
  switch (action.type) {
    case 'SET_TIME': {
      newState = JSON.parse(JSON.stringify(state))
      newState.timeInMilliseconds = action.timeInMilliseconds
      newState.startTime = action.startTime
      return newState
    }
    default: 
      return state
  }
}