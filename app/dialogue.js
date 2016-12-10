import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight, Animated, Dimensions } from 'react-native';
import { connect } from 'react-redux'
import globalStore from './globalStore'
import * as utils from './utils'

class Dialogue extends Component {
	constructor(props) {
		super(props)
		this.state = {topPosition: new Animated.Value(10000), state: 'CLOSED', timeString: '', scorerString: ''}
		this.getWindowHeight = this.getWindowHeight.bind(this)
		this.getWindowWidth = this.getWindowWidth.bind(this)
		this.getSizeStyle = this.getSizeStyle.bind(this)
		this.getAnimatedStyle = this.getAnimatedStyle.bind(this)
		this.getContent = this.getContent.bind(this)
		this.validate = this.validate.bind(this)
		this.submit = this.submit.bind(this)
		this.cancel = this.cancel.bind(this)
		Animated.spring(
		  this.state.topPosition,
		  {
		    toValue: this.getWindowHeight(),
		    friction: 9
		  }
		).start();

		globalStore.subscribe(() => {
			storeDialogueState = globalStore.getState().dialogueState.dialogueState
			if(this.state.state == 'CLOSED' && storeDialogueState !== 'CLOSED') {
				this.setState({state: 'OPEN', timeString: utils.stringify(this.props.options.goalTime)})
				Animated.spring(
				  this.state.topPosition,
				  {
				    toValue: 0,
				    friction: 9
				  }
				).start();
			} else if(this.state.state == 'OPEN' && storeDialogueState == 'CLOSED') {
				this.setState({state: 'CLOSED'})
				Animated.spring(
				  this.state.topPosition,
				  {
				    toValue: this.getWindowHeight(),
				    friction: 9
				  }
				).start();
			}
		})
	}

	getWindowWidth() {
		return Dimensions.get('window') ? Dimensions.get('window').width : 0
	}

	getWindowHeight() {
		return Dimensions.get('window') ? Dimensions.get('window').height : 0
	}

	getSizeStyle() {
		return {
			width: this.getWindowWidth(), height: this.getWindowHeight()
		}
	}

	getAnimatedStyle() {
		return {
      		marginTop: this.state.topPosition
		}
	}

	getContent() {
		return this.props.contentFunction(this)
	}


	validate() {
		if(this.props.validateFunction) return this.props.validateFunction(this);
		else return true;
	}
	submit() {
        if(!this.validate()) return;

		this.props.submitFunction(this)
		globalStore.dispatch({
			type: 'CLOSE_DIALOGUE'
		})
	}

	cancel() {
		switch(this.props.dialogueState) {
			case 'ADD_GOAL':
				
		}
		this.props.cancelFunction(this)
		globalStore.dispatch({
			type: 'CLOSE_DIALOGUE'
		})
	}

	render() {
		return (
			<Animated.View style={[
				this.getAnimatedStyle(),
				styles.dialogueContainer,
				this.props.dialogueState === 'CLOSED' ? styles.hidden : styles.unhidden]}>
				{this.getContent()}
			</Animated.View>
			)
	}
}

const mapStateToProps = (state) => {
  return {
    dialogueState: state.dialogueState.dialogueState,
    options: state.dialogueState.options,
    submitFunction: state.dialogueState.submitFunction == null ? (dialogue) => {
    	return
    } : state.dialogueState.submitFunction,
    contentFunction: state.dialogueState.contentFunction == null ? (dialogue) => {
    	return (
    		<View/>
    	)
    } : state.dialogueState.contentFunction,
    cancelFunction: state.dialogueState.cancelFunction == null ? (dialogue) => {
    	return
    } : state.dialogueState.cancelFunction,
    validateFunction: state.dialogueState.validateFunction == null ? (dialogue) => {
    	return
    } : state.dialogueState.validateFunction
  }
}

export default connect(mapStateToProps)(Dialogue)

const styles = StyleSheet.create({
  dialogueContainer: {
  	backgroundColor: globalStore.getState().styleState.lightHighlightColor,
    zIndex: -100,
    flex: 1
  },
  dialogueWrapper: {
  	flex: 1
  }
})