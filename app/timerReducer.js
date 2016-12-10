

const initialTimerState = {
  timeInMilliseconds: 0,
  startTime: 0,
  forcedStop: false
}

export default TimerReducer = (state = initialTimerState, action = {}) => {
  switch (action.type) {
    case 'SET_TIME': {
      newState = JSON.parse(JSON.stringify(state))
      newState.timeInMilliseconds = action.timeInMilliseconds
      newState.startTime = action.startTime
      return newState
    }
    case 'TIMER_FORCE_STOP': {
      if(state.forcedStop) return state;
      newState = JSON.parse(JSON.stringify(state))
      newState.forcedStop = true
      return newState
    }
    case 'TIMER_CLEAR_STOP': {
      if(!state.forcedStop) return state;
      newState = JSON.parse(JSON.stringify(state))
      newState.forcedStop = false
      return newState
    }
    default: 
      return state
  }
}