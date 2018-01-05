import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, TextInput, Animated} from 'react-native';
import { connect } from 'react-redux'
import * as utils from './utils'

export default class ConfirmationButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
    				awaitingConfirmation: false, 
    				width: new Animated.Value(30),
    				textOpacity: new Animated.Value(0),
    				initialMessage: props.initialMessage,
    				confirmationMessage: props.confirmationMessage,
    				defaultWidth: parseInt(props.defaultWidth),
    				maxWidth: parseInt(props.maxWidth),
    				submitFn: props.submitFn}
 	this.handlePress = this.handlePress.bind(this)
 	this.onFullyExtendedFn = this.onFullyExtendedFn.bind(this)
 	this.closeFn = this.closeFn.bind(this)
 	this.getInitialStyle = this.getInitialStyle.bind(this)
 	this.getConfirmationStyle = this.getConfirmationStyle.bind(this)
 	this.getWidth = this.getWidth.bind(this)
  }

  getInitialStyle() {
  	return {
  		opacity: 1-this.state.textOpacity
  	}
  }

  getConfirmationStyle() {
  	return {
  		opacity: this.state.textOpacity
  	}
  }

  getWidth() {
  	return {
  		width: this.state.width
  	}
  }

  closeFn() {

  	Animated.timing(
  		this.state.textOpacity,
  		{
  			toValue: 0,
  			duration: 10
  		})
  	Animated.timing(
          this.state.width,
          {
            toValue: this.state.defaultWidth,
            duration: 500
          }
        ).start()
  }


  onFullyExtendedFn(result) {
  	Animated.timing(
  		this.state.textOpacity,
  		{
  			toValue: 1,
  			duration: 10
  		})
  	if(result.finished) {
  		this.timeout = setTimeout(this.closeFn, 3000);
  	} else {
  		this.closeFn()
  		clearTimeout(this.timeout)
  	}
  }

  handlePress() {
  	var awaitingConfirmation = this.state.awaitingConfirmation
  	var fullyExtended = this.state.fullyExtended
  	if(!awaitingConfirmation) {
  		awaitingConfirmation = true
  		Animated.timing(
          this.state.width,
          {
            toValue: this.state.maxWidth,
            duration: 500
          }
        ).start(this.onFullyExtendedFn);
  	} else {
  		if(fullyExtended) {
  			this.state.submitFn();
  		}
  	}
  }

  render() {
    return (
        <TouchableHighlight
            disabled={this.state.disabled}
            underlayColor='gray'
            onPress={this.handlePress()}
            style={[styles.button]} >
            <Animated.View style={this.getWidth()}>
	            <Animated.Text style={this.getInitialStyle()}>
	            	{this.state.initialMessage}
	            </Animated.Text>
	            <Animated.Text style={this.getConfirmationStyle()}>
	            	{this.state.confirmationMessage}
	            </Animated.Text>
	        </Animated.View>
        </TouchableHighlight>
      )
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 15,
    height: 20,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonWrapper: {
  }
})