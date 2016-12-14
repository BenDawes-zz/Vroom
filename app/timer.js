
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import globalStore from './globalStore'
import * as utils from './utils'

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
    globalStore.subscribe(() => {
      if(globalStore.getState().timerState.forcedStop && this.state.running) {
        this.setState( {
          running: false,
          paused: true
        })
        clearInterval(this.interval)
        globalStore.dispatch({
          type: 'TIMER_CLEAR_STOP'
        })
      }
    })
  }

  handlePauseGo() {
    updateFunction = () => {
      // Update internal state
      newTime = new Date() - this.state.startTime
      this.setState( {
        timeInMilliseconds: newTime,
        running: true,
        paused: false
      } )
      // Update the global store
      globalStore.dispatch({
        type: 'SET_TIME',
        timeInMilliseconds: newTime,
        startTime: this.state.startTime,
      })
    }
    //Pause/Go button pressed
    if(!this.state.running) {
      //We were stopped
      if(!this.state.paused) {
        // This is the first time the timer is going after a reset. Set it to running
        this.setState( {
          timeInMilliseconds: 0, 
          startTime: new Date(),
          running: true,
          paused: false
        } )
        // Update the store with the timer state
        globalStore.dispatch({
          type: 'SET_TIME',
          timeInMilliseconds: 0,
          startTime: this.state.startTime
        })
        // Regularly update the timer
        this.interval = setInterval(updateFunction,100)
      } else {
        // We just pressed go having paused it. Update the start time to x milliseconds ago, where x is the current timer value
        this.setState( {
          startTime: new Date() - this.state.timeInMilliseconds,
          running: true,
          paused: false
        } )
        // Start counting from now
        this.interval = setInterval(updateFunction,100)
      }
      return;
    } else {
      // we're pausing it. Pause it, then clear the interval
      this.setState( {
        running: false,
        paused: true
      } )
      globalStore.dispatch({
          type: 'SET_TIME',
          timeInMilliseconds: 0,
          startTime: this.state.startTime
        })
      clearInterval(this.interval)
    }
  }

  handleReset() {
    if(this.state.running) {
      return;
    }
    // Clear the time and update interval
    this.setState( {
      timeInMilliseconds: 0, 
      startTime: new Date(),
      running: false,
      paused: false
    } )
    clearInterval(this.interval)
  }

  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.timer}>{utils.stringify(this.state.timeInMilliseconds)}</Text>
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