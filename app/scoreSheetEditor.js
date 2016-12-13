
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, TextInput} from 'react-native';
import { connect } from 'react-redux'
import globalStore from './globalStore'
import TeamNames from './teamNames'
import * as utils from './utils'

class ScoreSheetEditor extends Component {
  constructor(props) {
    super(props)
    this.cancel = this.cancel.bind(this)
    this.submit = this.submit.bind(this)
    this.validate = this.validate.bind(this)
    this.updateGoalTime = this.updateGoalTime.bind(this)
    this.updateGoalScorer = this.updateGoalScorer.bind(this)
    this.state = {
      dialogue: props.dialogue, 
      team: props.team, 
      snitches: JSON.parse(JSON.stringify(props.snitches)), 
      goals: JSON.parse(JSON.stringify(props.goals)), 
      goalValidities: props.goals.map((goal) => {return {timeValid: true, scorerValid: true}})
    }
  }

  validate() {
    var result = true;
    this.state.goalValidities.forEach((validities) => {
      result &= validities.timeValid && validities.scorerValid
    })
    return result
  }

  submit() {

    // TO DO: Validate?
    if(!this.validate()) return;

    // Save the state
    globalStore.dispatch({
      type: 'SCORESHEET_UPDATE',
      team: this.state.team,
      goals: this.state.goals,
      snitches: this.state.snitches
    })
    if(this.state.dialogue) {
      this.state.dialogue.submit()
    }
  }

  cancel() {
    // Save the state
    if(this.state.dialogue) {
      this.state.dialogue.cancel()
    }
  }

  updateGoalScorer(index, newScorer) {
    // Can do some checks that it is an acceptable scorer

    var curGoals = this.state.goals
    curGoals[index].scorerNumber = newScorer
    this.setState({goals: curGoals})
  }

  updateGoalTime(index, newTime) {
    if(utils.isValidTimeString(newTime)) {
      var curGoals = this.state.goals
      curGoals[index].timeInMilliseconds = utils.timeStringToMilliseconds(newTime)

      var tempGoalValidities = this.state.goalValidities
      tempGoalValidities[index].timeValid = true
      this.setState({goals: curGoals, goalValidities: tempGoalValidities})
    } else {
      var tempGoalValidities = this.state.goalValidities
      tempGoalValidities[index].timeValid = false
      this.setState({goalValidities: tempGoalValidities})
    }
  }
  render() {
    rowsContent = this.props.goals.map((goal,i) => {
      keyString = ''+i
      eventTime = goal.timeInMilliseconds
      scorerNumber = goal.scorerNumber
      if(scorerNumber == null || scorerNumber == '') {
        scorerNumber = 'N/A'
      }
      timeValid = this.state.goalValidities[i].timeValid
      scorerValid = this.state.goalValidities[i].scorerValid
      return  (
        <View style={styles.row} key={keyString}>
          <Text/>
          <TextInput style={[styles.input, timeValid ? {} : styles.invalid]} placeholder={utils.stringify(eventTime)}
            onChangeText={(text) => this.updateGoalTime(i, text)} defaultValue={utils.stringify(eventTime)}/>
          <TextInput style={[styles.input, scorerValid ? {} : styles.invalid]} placeholder={scorerNumber}
            onChangeText={(text) => this.updateGoalScorer(i, text)} defaultValue={scorerNumber}/>
        </View>
      )
    })
               
    return (
      <View style = {styles.scoreSheetWrapper}>
        <View style={styles.dialogueTop}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Modifying Score Sheet for {globalStore.getState().teamState.names[this.state.team]}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.header}>Goal Time</Text>
            <Text style={styles.header}>Goal Scorer</Text>
          </View>
          {rowsContent}
        </View>
        <View style={styles.submitRow}>
          <View style={styles.buttonWrapper}>
            <TouchableHighlight
            underlayColor='gray'
            onPress={() => this.submit()}
            style={[styles.button, styles.submitButton]} >
              <Text>
              Save
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
      )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}
export default connect(mapStateToProps)(ScoreSheetEditor)

const styles = StyleSheet.create({
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
    borderBottomWidth: 1,
    borderColor: globalStore.getState().styleState.globalBorderColor,
    flexDirection: 'row',
    paddingBottom: 5,
    paddingTop: 5
  },
  submitRow: {
    flexDirection: 'row',
    paddingBottom: 30
  }, 
  label: {
    flex: 1,
    fontSize: 16
  },
  input: {
    flex: 1,
    fontSize: 16
  },
  header: {
    flex: 1,
    fontSize: 20
  },
  invalid: {
    color: '#ff0000'
  }
})