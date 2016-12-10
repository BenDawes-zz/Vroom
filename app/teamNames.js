import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput} from 'react-native';
import { connect } from 'react-redux'
import globalStore from './globalStore'

class TeamNames extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		return (
			<View style={styles.namesView}>
				<View style={[styles.nameView, {paddingLeft: 5, borderRightWidth: 1, borderColor: globalStore.getState().styleState.globalBorderColor}]}>
					<TextInput 
					 style={[styles.name, {textAlign: 'left'}]}
					 onChangeText={(text) => globalStore.dispatch({
					 	type: 'SET_NAME',
					 	teamIndex: 0,
					 	newName: text
					 })}
					 editable={!this.props.disabled}
					 placeholder='Team A'
					 value={this.props.names[0]}
					 />
				 </View>
				 <View style={[styles.nameView, {paddingRight: 5}]}>
					<TextInput 
					 style={[styles.name, {textAlign: 'right'}]}
					 onChangeText={(text) => globalStore.dispatch({
					 	type: 'SET_NAME',
					 	teamIndex: 1,
					 	newName: text
					 })}
					 editable={!this.props.disabled}
					 placeholder='Team B'
					 value={this.props.names[1]}
					 />
				</View>
			</View>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    names: state.teamState.names,
    disabled: state.dialogueState.dialogueState !== 'CLOSED'
  }
}

export default connect(mapStateToProps)(TeamNames)

const styles = StyleSheet.create({
  namesView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  nameView: {
    flexDirection: 'row',
  	flex: 1
  },
  name: {
  	flex: 1,
  	fontSize: 20
  }
 })