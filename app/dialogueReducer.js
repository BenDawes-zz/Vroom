import React, { Component } from 'react';
import { View } from 'react-native';


const initialDialogueState = {
	dialogueState: 'CLOSED',
	options: {
  },
  submitFunction: null,
  contentFunction: (dialogue) => {
    return (
      <View/>
      )
  },
  cancelFunction: () => { return },
  validateFunction: () => { return true }
}

export default DialogueReducer = (state = initialDialogueState, action = {}) => {
  switch (action.type) {
    case 'OPEN_DIALOGUE': {
      newState = JSON.parse(JSON.stringify(state))
      newState.dialogueState = action.dialogueState
      newState.options = action.options
      if(action.submitFunction !== null) {
        newState.submitFunction = action.submitFunction
      }
      if(action.contentFunction !== null) {
        newState.contentFunction = action.contentFunction
      }
      if(action.cancelFunction !== null) {
        newState.cancelFunction = action.cancelFunction
      }
      if(action.validateFunction !== null) {
        newState.validateFunction = action.validateFunction
      }
      return newState
    }
    case 'CLOSE_DIALOGUE': {
      newState = JSON.parse(JSON.stringify(state))
      newState.dialogueState = 'CLOSED'
      return newState
    }
    default: 
      return state
  }
}