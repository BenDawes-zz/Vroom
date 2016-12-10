
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Dimensions, Animated } from 'react-native';
import ScoringController from './scoringController'
import PenaltiesDigest from './penaltiesDigest'
import Dialogue from './dialogue'
import { connect } from 'react-redux'

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedIndex: 0, tabsMargin: new Animated.Value(0)}
    this.select = this.select.bind(this)
    this.panesStyle = this.panesStyle.bind(this)
    this.windowWidthStyle = this.windowWidthStyle.bind(this)
    this.getWindowWidth = this.getWindowWidth.bind(this)
    this.updateGlobalState = this.props.updateGlobalState.bind(this)
  }

  select(index) {
    return () => {
      oldIndex = this.state.selectedIndex
      if(oldIndex == index) {
        // If you click on the same tab, do nothing
        return null;
      } else {
        // Otherwise, move the margin to x*width, where x is the tab index
        this.setState({selectedIndex: index})
        Animated.spring(
          this.state.tabsMargin,
          {
            toValue: 0 - (index * this.getWindowWidth()),
            friction: 9
          }
        ).start();

      }
    }
  }

  getWindowWidth() {
    return Dimensions.get('window') ? Dimensions.get('window').width : 0
  }

  windowWidthStyle() {
    return {
      width: this.getWindowWidth()
    }
  }

  panesStyle() {
    return {
      marginLeft: this.state.tabsMargin,
      flexDirection: 'row',
      flex: 10
    }
  }

  render() {
    return (
      <View style = {[styles.container, this.windowWidthStyle()]}>
        <View style={styles.tabsView}>
          <View style = {styles.tabView}>
            <TouchableHighlight 
            style={[styles.tabButton, this.state.selectedIndex == 0 ? styles.selected : styles.unselected, {width: this.getWindowWidth()/parseInt(this.props.tabCount)}]}
            onPress={this.select(0)}
            disabled={this.props.disabled}
            ><Text style={styles.tabTitle}>Scoring</Text></TouchableHighlight>
          </View>
          <View style = {styles.tabView}>
            <TouchableHighlight 
            style={[styles.tabButton, this.state.selectedIndex == 1 ? styles.selected : styles.unselected, {width: this.getWindowWidth()/parseInt(this.props.tabCount)}]}
            onPress={this.select(1)}
            disabled={this.props.disabled}

            ><Text style={styles.tabTitle}>Penalties</Text></TouchableHighlight>
          </View>
        </View>

        <Animated.View style={this.panesStyle()}>
         <View style={this.windowWidthStyle()}>
          <ScoringController/>
          <PenaltiesDigest/>
         </View>
         <View style={this.windowWidthStyle()}>
          <Text> Test2</Text>
         </View>
        </Animated.View>

        <View style={styles.dialogueContainer} pointerEvents={this.props.disabled ? 'auto' : 'none'}>
          <Dialogue style={{flex: 1}}/> 
        </View>
      </View>
      )
  }
}

const mapStateToProps = (state) => {
  return {
    disabled: state.dialogueState.dialogueState !== 'CLOSED'
  }
}

export default connect(mapStateToProps)(Tabs);

const styles = StyleSheet.create({
  dialogueContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  container: {
    flex: 1,
  },
  selected: {
    backgroundColor: globalState.getState().styleState.darkHighlightColor
  },
  tabButton: {
    flex: 1,
    backgroundColor: globalState.getState().styleState.lightHighlightColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabsView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: globalState.getState().styleState.globalBorderColor
  },
  tabView: {
    flex: 1
  },
  tabContainer: {
    flex: 1
  },
  tabTitle: {
    textAlign: 'center'
  }
});