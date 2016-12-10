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
  cancelFunction: () => { return }
}

export default DialogueReducer = (state = initialDialogueState, action = {}) => {
  switch (action.type) {
    case 'OPEN_DIALOGUE': {
      newState = JSON.parse(JSON.stringify(state))
      newState.dialogueState = action.dialogueState
      newState.options = action.options
      newState.submitFunction = action.submitFunction
      newState.contentFunction = action.contentFunction
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