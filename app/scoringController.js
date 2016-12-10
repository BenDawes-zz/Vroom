// app/index.js

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, TextInput} from 'react-native';
import { connect } from 'react-redux'
import globalStore from './globalStore'
import TeamNames from './teamNames'
import * as utils from './utils'

class Score extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <View style = {styles.scoreWrapper}>
        <Text style={styles.scoreValue}>{this.props.teamOneScore}</Text>
        <Text style={styles.hyphenValue}>-</Text>
        <Text style={styles.scoreValue}>{this.props.teamTwoScore}</Text>
      </View>
      )
  }
}

class ScoreControls extends Component {
  constructor(props) {
    super(props)
    this.changeScore = this.props.changeFn.bind(this)
    this.setScore = this.props.setFn.bind(this)
    this.raiseAddGoalDialogue = this.props.raiseAddGoalDialogueFn.bind(this)
    this.raiseRemoveGoalDialogue = this.props.raiseRemoveGoalDialogueFn.bind(this)
    this.raiseAddSnitchDialogue = this.props.raiseAddSnitchDialogueFn.bind(this)
    this.enterEditScoresheetMode = this.props.enterEditScoresheetModeFn.bind(this)
  }

  render() {
    return (
      <View style={styles.controlWrapper}>
        <View style={[styles.controlPanel, {borderWidth: 1}]}>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.raiseAddGoalDialogue(0)}
            style={[styles.button, styles.addGoalButton]} >
            <Text>
            Add Goal
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.raiseRemoveGoalDialogue(0)}
            style={[styles.button, styles.removeGoalButton]} >
            <Text>
            Remove Last Goal
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.raiseAddSnitchDialogue(0)}
            style={[styles.button, styles.addSnitchButton]} >
            <Text>
            Add Snitch
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.enterEditScoresheetMode(0)}
            style={[styles.button, styles.editScoresheetButton]} >
            <Text>
            Edit Scoresheet
            </Text>
          </TouchableHighlight>
        </View>
        <View style={[styles.controlPanel,{borderWidth: 1}, {borderLeftWidth: 0}]}>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.raiseAddGoalDialogue(1)}
            style={[styles.button, styles.addGoalButton]} >
            <Text>
            Add Goal
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.raiseRemoveGoalDialogue(1)}
            style={[styles.button, styles.removeGoalButton]} >
            <Text>
            Remove Last Goal
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.raiseAddSnitchDialogue(1)}
            style={[styles.button, styles.addSnitchButton]} >
            <Text>
            Add Snitch
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.enterEditScoresheetMode(1)}
            style={[styles.button, styles.editScoresheetButton]} >
            <Text>
            Edit Scoresheet
            </Text>
          </TouchableHighlight>
        </View>
      </View>
      )
  }
}

 class ScoringController extends Component {
  constructor(props) {
    super(props)
    this.changeScore = this.changeScore.bind(this)
    this.setScore = this.setScore.bind(this)
    this.raiseAddGoalDialogue = this.raiseAddGoalDialogue.bind(this)
    this.raiseRemoveGoalDialogue = this.raiseRemoveGoalDialogue.bind(this)
    this.raiseAddSnitchDialogue = this.raiseAddSnitchDialogue.bind(this)
    this.enterEditScoresheetMode = this.enterEditScoresheetMode.bind(this)
  }

  raiseAddGoalDialogue(team) {
    var goalTime = globalStore.getState().timerState.timeInMilliseconds;
    var goalIndex = globalStore.getState().scoreState.goals[team].length;
    globalStore.dispatch({
      type: 'ADD_GOAL',
      timeInMilliseconds: goalTime,
      teamIndex: team,
      scorerNumber: null
    })
    globalStore.dispatch({
      type: 'OPEN_DIALOGUE',
      dialogueState: 'ADD_GOAL',
      options: {
        goalTime: goalTime,
        teamIndex: team,
        scorerNumber: null,
        goalIndex: goalIndex
      },
      submitFunction: (dialogue) => {
          globalStore.dispatch({
          type: 'EDIT_GOAL',
          timeInMilliseconds: utils.timeStringToMilliseconds(dialogue.state.timeString),
          teamIndex: dialogue.props.options.teamIndex,
          goalIndex: dialogue.props.options.goalIndex,
          scorerNumber: dialogue.state.scorerString
          })
          globalStore.dispatch({
            type: 'CLOSE_DIALOGUE'
          })
        },
      contentFunction: (dialogue) => {
        return (
          <View style={styles.dialogueWrapper} key='dialogue'>
            <View style={styles.dialogueTop}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>Adding Goal To {globalStore.getState().teamState.names[team]}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Goal Time:</Text>
                <TextInput style={styles.input} placeholder={utils.stringify(goalTime)}
                 onChangeText={(text) => dialogue.setState({timeString: text})} defaultValue={utils.stringify(goalTime)}/>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Player Number:</Text><TextInput style={styles.input} placeholder='N/A'
                 onChangeText={(text) => dialogue.setState({scorerString: text})}/>
              </View>
            </View>
            <View style={styles.submitRow}>
              <View style={styles.buttonWrapper}>
                <TouchableHighlight
                underlayColor='gray'
                onPress={() => dialogue.submit()}
                style={[styles.button, styles.submitButton]} >
                  <Text>
                  Submit
                  </Text>
                </TouchableHighlight>
              </View>
              <View style={styles.buttonWrapper}>
                <TouchableHighlight
                underlayColor='gray'
                onPress={() => dialogue.cancel()}
                style={[styles.button, styles.cancelButton]} >
                  <Text>
                  Cancel
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          )
      },
      cancelFunction: (dialogue) => {
        globalStore.dispatch({
          type: 'REMOVE_GOAL',
          teamIndex: team,
          goalIndex: goalIndex
        })
      },
      validateFunction: (dialogue) => {
        result = true
        timeLength = dialogue.state.timeString.length
        if(dialogue.state.timeString[timeLength - 3] !== ':' || timeLength > 5 || utils.timeStringToMilliseconds(dialogue.state.timeString) == -1) {
          result = false
        }
        return result
      }
    })
  }

  raiseRemoveGoalDialogue(team) {
    var goalIndex = globalStore.getState().scoreState.goals[team].length-1
    if(goalIndex == -1) {
      return
    }
    var goalTime = globalStore.getState().scoreState.goals[team][goalIndex].timeInMilliseconds
    var scorerNumber = globalStore.getState().scoreState.goals[team][goalIndex].scorerNumber
    var teamName = globalStore.getState().teamState.names[team]
    if(scorerNumber === null) {
      scorerNumber = 'N/A'
    }
    globalStore.dispatch({
      type: 'OPEN_DIALOGUE',
      dialogueState: 'REMOVE_GOAL',
      options: {
      },
      submitFunction: (dialogue) => {
          globalStore.dispatch({
            type: 'REMOVE_GOAL',
            teamIndex: team,
            goalIndex: goalIndex
          })
      },
      contentFunction: (dialogue) => {
        return (
          <View style={styles.dialogueWrapper} key='dialogue'>
            <View style={styles.dialogueTop}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>REMOVING Goal From {teamName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Goal Time:</Text>
                <Text style={styles.value}>{utils.stringify(goalTime)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Player Number:</Text><Text style={styles.label}>{scorerNumber}</Text>
              </View>
            </View>
            <View style={styles.submitRow}>
              <View style={styles.buttonWrapper}>
                <TouchableHighlight
                underlayColor='gray'
                onPress={() => dialogue.submit()}
                style={[styles.button, styles.submitButton]} >
                  <Text>
                  Remove
                  </Text>
                </TouchableHighlight>
              </View>
              <View style={styles.buttonWrapper}>
                <TouchableHighlight
                underlayColor='gray'
                onPress={() => dialogue.cancel()}
                style={[styles.button, styles.cancelButton]} >
                  <Text>
                  Cancel
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          )
      }
    })
  }

  raiseAddSnitchDialogue(team) {
    catchTime = new Date()
    globalStore.dispatch({
      type: 'OPEN_DIALOGUE',
      dialogueState: 'ADD_SNITCH',
      options: {
        teamIndex: team,
        catcherNumber: null,
        timeInMilliseconds: catchTime
      }
    })
  }

  enterEditScoresheetMode(team) {

  }

  changeScore(team,diff) {
  }

  setScore(team,value) {
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <TeamNames style={styles.namesContainer}/>
        <Score style = {styles.scoreContainer} teamOneScore={this.props.scores[0]} teamTwoScore={this.props.scores[1]}/>
        <ScoreControls style = {styles.scoreControlsContainer} 
        changeFn = {this.changeScore} 
        setFn = {this.setScore}
        raiseAddGoalDialogueFn = {this.raiseAddGoalDialogue}
        raiseRemoveGoalDialogueFn = {this.raiseRemoveGoalDialogue}
        raiseAddSnitchDialogueFn = {this.raiseAddSnitchDialogue}
        enterEditScoresheetModeFn = {this.enterEditScoresheetMode}
        disabled = {this.props.disabled}
        />
      </View>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    scores: state.scoreState.scores,
    goals: state.scoreState.goals,
    snitches: state.scoreState.snitches,
    disabled: state.dialogueState.dialogueState !== 'CLOSED'
  }
}
export default connect(mapStateToProps)(ScoringController)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  scoreWrapper: {
    flexDirection: 'row',
    borderColor: globalStore.getState().styleState.globalBorderColor,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1
  },
  controlWrapper: {
    flexDirection: 'row',
    flex: 10
  },
  scoreValue: {
    flex: 5,
    fontSize: 70,
    textAlign: 'center'
  },
  hyphenValue: {
    flex: 1,
    fontSize: 70
  },
  controlPanel: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    borderColor: globalStore.getState().styleState.globalBorderColor,
    paddingBottom: 5
  },
  button: {
    borderWidth: 2,
    height: 30,
    width: 150,
    borderRadius: 15,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addGoalButton: {
    backgroundColor: '#33ccff'
  },
  removeGoalButton: {
    backgroundColor: '#ff3300'
  },
  addSnitchButton: {
    backgroundColor: '#ffcc00'
  },
  editScoresheetButton: {
    backgroundColor: '#ff3399'
  },
  penaltyDigestContainer: {
    flex: 1
  },
  buttonWrapper: {
    flex: 1,
    alignItems: 'center'
  },
  button: {
    borderWidth: 2,
    height: 30,
    width: 150,
    borderRadius: 15,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButton: {
    backgroundColor: '#33ccff'
  },
  cancelButton: {
    backgroundColor: '#ff3300'
  },
  dialogueTop: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 10
  },
  submitRow: {
    flexDirection: 'row',
    paddingBottom: 30
  }, 
  label: {
    flex: 1
  },
  input: {
    flex: 1,
    fontSize: 20
  }
});
