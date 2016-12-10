
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import globalStore from './globalStore'

class Controls extends Component {

  constructor(props) {
    super(props)
    this.handlePauseGo = this.props.handlePauseGo.bind(this)
    this.handleReset = this.props.handleReset.bind(this)
  }
  emptyFn() {
    return null
  }
  render() {
    return (
      <View style={styles.controlsWrapper}>
        <TouchableHighlight
          underlayColor='gray'
          onPress={this.handlePauseGo}
          style={[styles.button, this.props.running ? styles.pauseButton : styles.goButton]} >
          <Text>
          {this.props.running ? 'Pause' : 'Go'}
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='gray'
          onPress={this.props.running ? this.emptyFn : this.handleReset}
          style={[styles.button, this.props.running ? styles.disabledReset : styles.enabledReset]} >
          <Text>
          Reset
          </Text>
        </TouchableHighlight>
      </View>
      )
  }
}

export default class Timer extends Component {

  constructor(props) {
    super(props);
    this.state = {timeInMilliseconds: 0, 
                  startTime: null,
                  running: false,
                  paused: false}
    this.handlePauseGo = this.handlePauseGo.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.seconds = this.seconds.bind(this)
    this.minutes = this.minutes.bind(this)
    this.padToTwo = this.padToTwo.bind(this)
  }

  handlePauseGo() {
    if(!this.state.running) {
      if(!this.state.paused) {
        this.setState( {
          timeInMilliseconds: 0, 
          startTime: new Date(),
          running: true,
          paused: false
        } )
        globalStore.dispatch({
          type: 'SET_TIME',
          timeInMilliseconds: 0,
          startTime: this.state.startTime
        })
        this.interval = setInterval(() => {
          this.setState( {
            timeInMilliseconds: new Date() - this.state.startTime,
            running: true,
            paused: false
          } )
          globalStore.dispatch({
            type: 'SET_TIME',
            timeInMilliseconds: new Date() - this.state.startTime,
            startTime: this.state.startTime,
          })
        })
      } else {
        this.setState( {
          startTime: new Date() - this.state.timeInMilliseconds,
          running: true,
          paused: false
        } )
        this.interval = setInterval(() => {
          this.setState( {
            timeInMilliseconds: new Date() - this.state.startTime,
            running: true,
            paused: false
          } )
          globalStore.dispatch({
            type: 'SET_TIME',
            timeInMilliseconds: new Date() - this.state.startTime,
            startTime: this.state.startTime,
          })
        })
      }
      return;
    } else {
      this.setState( {
        running: false,
        paused: true
      } )
      clearInterval(this.interval)
    }
  }

  handleReset() {
    if(this.state.running) {
      return;
    }
    this.setState( {
      timeInMilliseconds: 0, 
      startTime: new Date(),
      running: false
    } )
    clearInterval(this.interval)
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
  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.timer}>{this.minutes(this.state.timeInMilliseconds) + ":" + this.seconds(this.state.timeInMilliseconds)}</Text>
        <Controls 
         handlePauseGo = {this.handlePauseGo}
         handleReset = {this.handleReset}
         running = {this.state.running}/>
      </View>
      )
  }
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 60
  },
  view: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:  globalStore.getState().styleState.globalBorderColor,
    borderWidth: 1
  },
  button: {
    borderWidth: 2,
    height: 30,
    width: 100,
    borderRadius: 15,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  controlsWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 10
  },
  goButton: {
    backgroundColor: '#66ffff'
  },
  pauseButton: {
    backgroundColor: '#ff9966'
  },
  disabledReset: {
    backgroundColor: '#e0ebeb'
  },
  enabledReset: {
    backgroundColor: '#ff6666'
  }
});