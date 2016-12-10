import { combineReducers, createStore } from 'redux'
import ScoreReducer from './scoreReducer'
import StyleReducer from './styleReducer'
import TeamReducer from './teamReducer'
import PenaltiesReducer from './penaltiesReducer'
import TimerReducer from './timerReducer'
import DialogueReducer from './dialogueReducer'

export default globalState = createStore(combineReducers({
	scoreState: ScoreReducer, 
	styleState: StyleReducer, 
	teamState: TeamReducer, 
	penaltiesState: PenaltiesReducer, 
	dialogueState: DialogueReducer, 
	timerState: TimerReducer}))