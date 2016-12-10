import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight, Animated, Dimensions } from 'react-native';
import { connect } from 'react-redux'
import globalStore from './globalStore'

///TO DO : MAKE IT POP UP

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
		this.milliseconds = this.milliseconds.bind(this)
		this.seconds = this.seconds.bind(this)
		this.minutes = this.minutes.bind(this)
		this.padToTwo = this.padToTwo.bind(this)
		this.stringify = this.stringify.bind(this)
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
				this.setState({state: 'OPEN', timeString: this.stringify(this.props.options.goalTime)})
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
		/*contents = {
			'ADD_GOAL': [(
				<View style={styles.dialogueWrapper} key='dialogue'>
					<View style={styles.dialogueTop}>
						<View style={styles.titleRow}>
							<Text style={styles.title}>Adding Goal To {globalStore.getState().teamState.names[this.props.options.teamIndex]}</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.label}>Goal Time:</Text>
							<TextInput style={styles.input} placeholder={this.stringify(this.props.options.goalTime)}
							 onChangeText={(text) => this.setState({timeString: text})} defaultValue={this.stringify(this.props.options.goalTime)}/>
						</View>
						<View style={styles.row}>
							<Text style={styles.label}>Player Number:</Text><TextInput style={styles.input} placeholder='N/A' defaultValue={this.props.options.scorerNumber}
							 onChangeText={(text) => this.setState({scorerString: text})}/>
						</View>
					</View>
					<View style={styles.submitRow}>
						<View style={styles.buttonWrapper}>
							<TouchableHighlight
							underlayColor='gray'
							onPress={() => this.submit()}
							style={[styles.button, styles.submitButton]} >
								<Text>
								Submit
								</Text>
							</TouchableHighlight>
						</View>
						<View style={styles.buttonWrapper}>
							<TouchableHighlight
							underlayColor='gray'
							onPress={() => this.cancel()}
							style={[styles.button, styles.cancelButton]} >
								<Text>
								Cancel
								</Text>
							</TouchableHighlight>
						</View>
					</View>
				</View>
				)],
			'REMOVE_GOAL': ([(
				<View style={styles.dialogueWrapper} key='dialogue'>
					<View style={styles.dialogueTop}>
						<View style={styles.titleRow}>
							<Text style={styles.title}>REMOVING Goal From {this.props.options.teamName}</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.label}>Goal Time:</Text>
							<Text style={styles.value}>{this.stringify(this.props.options.goalTime)}</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.label}>Player Number:</Text><Text style={styles.label}>{this.props.options.scorerNumber}</Text>
						</View>
					</View>
					<View style={styles.submitRow}>
						<View style={styles.buttonWrapper}>
							<TouchableHighlight
							underlayColor='gray'
							onPress={() => this.submit()}
							style={[styles.button, styles.submitButton]} >
								<Text>
								Remove
								</Text>
							</TouchableHighlight>
						</View>
						<View style={styles.buttonWrapper}>
							<TouchableHighlight
							underlayColor='gray'
							onPress={() => this.cancel()}
							style={[styles.button, styles.cancelButton]} >
								<Text>
								Cancel
								</Text>
							</TouchableHighlight>
						</View>
					</View>
				</View>
				)]
				),
			'ADD_SNITCH': (
				<View/>
				),
			'CLOSED': [(
				<View style={styles.dialogueWrapper} key='dialogue'/>
				)]
		}*/

		return this.props.contentFunction(this)
		return contents[this.props.dialogueState]
	}

	padToTwo(s) {
	return (s+'').length == 1 ? '0' + s : s + ''
	}

	seconds(timeInMilliseconds) {
	let val = (Math.floor(timeInMilliseconds/1000)) % 60
	return val ? this.padToTwo(val)+'' : '00'
	}

	minutes(timeInMilliseconds) {
	let val = ((Math.floor(timeInMilliseconds/1000)) - this.seconds(timeInMilliseconds))/60
	return val ? this.padToTwo(val) : '00'
	}

	stringify(timeInMilliseconds) {
		return this.minutes(timeInMilliseconds) + ':' + this.seconds(timeInMilliseconds)
	}

	milliseconds(s) {
		nums = s.split(':')
		if(nums.length !== 2) return -1
		return 1000*((parseInt(nums[0])*60)+parseInt(nums[1]))
	}

	validate() {
		switch(this.props.dialogueState) {
			case 'ADD_GOAL':
				result = true
				timeLength = this.state.timeString.length
				if(this.state.timeString[timeLength - 3] !== ':' || timeLength > 5 || this.milliseconds(this.state.timeString) == -1) {
					result = false
				}
				return result
			default:
				return true
		}
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
    } : state.dialogueState.cancelFunction
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