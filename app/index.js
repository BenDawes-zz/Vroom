import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Timer from './timer'
import Tabs from './tabs'
import Tab from './tabs'
import Dialogue from './dialogue'
import globalStore from './globalStore'
import { Provider } from 'react-redux'

export default class MainApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeInMilliseconds: 0,
      scores: [0, 0],
      goals: [
        [],
        []
      ]
    }
    this.updateGlobalState = this.updateGlobalState.bind(this)
  }

  updateGlobalState(options) {
    this.setState(options)
  }

  render() {
    return (
      <Provider store={globalState}>
        <View style={styles.mainContainer}>
          <Timer style={styles.timerContainer} updateGlobalState={this.updateGlobalState}/>
          <Tabs tabCount='2' style={styles.tabsContainer} timeInMilliseconds= {this.state.timeInMilliseconds} updateGlobalState={this.updateGlobalState}>
          </Tabs>
          
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: globalStore.getState().styleState.globalBackgroundColor
  },
  dialogueContainer: {
    position: 'absolute',
    top: 0,
    left: 0
  }
});
