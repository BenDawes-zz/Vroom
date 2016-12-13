// app/index.js

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, TextInput} from 'react-native';
import { connect } from 'react-redux'
import globalStore from './globalStore'
import TeamNames from './teamNames'
import ScoreSheetEditor from './scoreSheetEditor'
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
    this.enterEditScoresheetMode = this.props.enterEditScoresheetModeFn.bind(this)
    this.raiseDialogue = this.props.raiseDialogue.bind(this)
  }

  render() {
    return (
      <View style={styles.controlWrapper}>
        <View style={[styles.controlPanel, {borderWidth: 1}]}>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.raiseDialogue('ADD_GOAL',0)}
            style={[styles.button, styles.addGoalButton]} >
            <Text>
            Add Goal
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.raiseDialogue('REMOVE_GOAL',0)}
            style={[styles.button, styles.removeGoalButton]} >
            <Text>
            Remove Last Goal
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.raiseDialogue('ADD_SNITCH',0)}
            style={[styles.button, styles.addSnitchButton]} >
            <Text>
            Add Snitch
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.raiseDialogue('EDIT_SCORESHEET',0)}
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
            onPress={() => this.raiseDialogue('ADD_GOAL',1)}
            style={[styles.button, styles.addGoalButton]} >
            <Text>
            Add Goal
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.raiseDialogue('REMOVE_GOAL',1)}
            style={[styles.button, styles.removeGoalButton]} >
            <Text>
            Remove Last Goal
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.raiseDialogue('ADD_SNITCH',1)}
            style={[styles.button, styles.addSnitchButton]} >
            <Text>
            Add Snitch
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={this.props.disabled}
            underlayColor='gray'
            onPress={() => this.raiseDialogue('EDIT_SCORESHEET',1)}
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
    this.enterEditScoresheetMode = this.enterEditScoresheetMode.bind(this)
    this.raiseDialogue = this.raiseDialogue.bind(this)
  }

  raiseDialogue(type, team) {

    defaultContentWrapper = (title, rows, dialogue) => {
      rowsContent = []
      var i = 0
      rows.forEach((row) => {
        keyString = ''+i
        i = i + 1
        rowsContent.push((
          <View key={keyString} >
            {row}
          </View>
        ))
      })
      // The custom content inside the dialogue
      return (
        <View style={styles.dialogueWrapper} key='dialogue'>
          <View style={styles.dialogueTop}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{title}</Text>
            </View>
            {rowsContent}
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
      }


    var submitFunction;
    var cancelFunction;
    var contentFunction;
    var validateFunction = () => {return true};

    switch(type) {
      case 'ADD_GOAL': {
        var eventTime = globalStore.getState().timerState.timeInMilliseconds;
        var goalIndex = globalStore.getState().scoreState.goals[team].length;

        // Immediately store it
        globalStore.dispatch({
          type: 'ADD_GOAL',
          timeInMilliseconds: eventTime,
          teamIndex: team,
          scorerNumber: null
        })
        submitFunction = (dialogue) => {
        // On submit, modify the goal we stored at button-press with the new info
          globalStore.dispatch({
          type: 'EDIT_GOAL',
          timeInMilliseconds: utils.timeStringToMilliseconds(dialogue.state.timeString),
          teamIndex: team,
          goalIndex: goalIndex,
          scorerNumber: dialogue.state.scorerString
          })
        }
        // If the user cancels the dialogue, they've accidentally pressed add goal, so remove it
        cancelFunction = (dialogue) => {
          globalStore.dispatch({
            type: 'REMOVE_GOAL',
            teamIndex: team,
            goalIndex: goalIndex
          })
        }
        // To check the user input, we just check the time is in a nice format (##:##)
        validateFunction = (dialogue) => {
          return utils.isValidTimeString(dialogue.state.timeString)
        }
        contentFunction = (dialogue) => {
          var rows = [
              (
                <View style={styles.row}>
                <Text style={styles.label}>Goal Time:</Text>
                <TextInput style={styles.input} placeholder={utils.stringify(eventTime)}
                  onChangeText={(text) => dialogue.setState({timeString: text})} defaultValue={utils.stringify(eventTime)}/>
                </View>
              ),
              (
                <View style={styles.row}>
                <Text style={styles.label}>Player Number:</Text>
                <TextInput style={styles.input} placeholder='N/A'
                   onChangeText={(text) => dialogue.setState({scorerString: text})}/>
                </View>
              )
            ]
          var title = (<Text>Adding Goal To {globalStore.getState().teamState.names[team]}</Text>)
          return defaultContentWrapper(title, rows, dialogue)
        }
        break;
      }
      case 'REMOVE_GOAL': {
        var goalIndex = globalStore.getState().scoreState.goals[team].length-1
        if(goalIndex == -1) {
          return
        }
        // Get the info to populate the dialogue
        var eventTime = globalStore.getState().scoreState.goals[team][goalIndex].timeInMilliseconds
        var scorerNumber = globalStore.getState().scoreState.goals[team][goalIndex].scorerNumber
        var teamName = globalStore.getState().teamState.names[team]


        // For when the scorer wasn't input
        if(scorerNumber === null) {
          scorerNumber = 'N/A'
        }

        contentFunction = (dialogue) => {
          var rows = [
            (
            <View style={styles.row}>
              <Text style={styles.label}>Goal Time:</Text>
              <Text style={styles.value}>{utils.stringify(eventTime)}</Text>
            </View>
            ),
            (
            <View style={styles.row}>
              <Text style={styles.label}>Player Number:</Text><Text style={styles.value}>{scorerNumber}</Text>
            </View>
            )
          ]
          var title = (<Text>REMOVING Goal From {teamName}</Text>)
          return defaultContentWrapper(title, rows, dialogue)
        }

        submitFunction = (dialogue) => {
          // On submit, remove that goal
          globalStore.dispatch({
            type: 'REMOVE_GOAL',
            teamIndex: team,
            goalIndex: goalIndex
          })
        }
        break;
      }
      case 'ADD_SNITCH': {
        var eventTime = globalStore.getState().timerState.timeInMilliseconds;

        submitFunction = (dialogue) => {
          // On submit, add the snitch
            globalStore.dispatch({
            type: 'ADD_SNITCH',
            timeInMilliseconds: utils.timeStringToMilliseconds(dialogue.state.timeString),
            teamIndex: team,
            catcherNumber: dialogue.state.catcherString
            })
          // Stop the timer
            globalStore.dispatch({
              type: 'TIMER_FORCE_STOP'
            })
          }
         // To check the user input, we just check the time is in a nice format (##:##)
        validateFunction: (dialogue) => {
          result = true
          nums = dialogue.state.timeString.split(':')
          if(nums.length !== 2 || nums[0].length > 2 || nums[0].length == 0 || nums[1].length != 2 || utils.timeStringToMilliseconds(dialogue.state.timeString) < 0) {
            result = false
          }
          return result
        }

        contentFunction = (dialogue) => {
          var rows = [
            (
            <View style={styles.row}>
              <Text style={styles.label}>Catch Time:</Text>
              <TextInput style={styles.input} placeholder={utils.stringify(eventTime)}
               onChangeText={(text) => dialogue.setState({timeString: text})} defaultValue={utils.stringify(eventTime)}/>
            </View>
            ),
            (
            <View style={styles.row}>
              <Text style={styles.label}>Player Number:</Text><TextInput style={styles.input} placeholder='N/A'
               onChangeText={(text) => dialogue.setState({catcherString: text})}/>
            </View>
            )
          ]
          var title = (<Text>Adding Snitch Catch To {globalStore.getState().teamState.names[team]}</Text>)
          return defaultContentWrapper(title, rows, dialogue)
        }

        break;
      }
      case 'EDIT_SCORESHEET': {

        submitFunction = (dialogue) => {
          
          }
         // To check the user input, we just check the time is in a nice format (##:##)
        validateFunction: (dialogue) => {
          return true
        }

        contentFunction = (dialogue) => {
         return <ScoreSheetEditor 
                  team={team} 
                  dialogue={dialogue}
                  goals={globalStore.getState().scoreState.goals[team]}
                  snitches={globalStore.getState().scoreState.snitches[team]}/>
        }

        break;
      }
      default: {
        return;
      }
    }
    
    globalStore.dispatch({
      type: 'OPEN_DIALOGUE',
      dialogueState: type,
      options: {
      },
      submitFunction: submitFunction,
      cancelFunction: cancelFunction,
      validateFunction: validateFunction,
      contentFunction: contentFunction
    })  
  }

  enterEditScoresheetMode(team) {

  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <TeamNames style={styles.namesContainer}/>
        <Score style = {styles.scoreContainer} teamOneScore={this.props.scores[0]} teamTwoScore={this.props.scores[1]}/>
        <ScoreControls style = {styles.scoreControlsContainer} 
        changeFn = {this.changeScore} 
        setFn = {this.setScore}
        enterEditScoresheetModeFn = {this.enterEditScoresheetMode}
        raiseDialogue = {this.raiseDialogue}
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
