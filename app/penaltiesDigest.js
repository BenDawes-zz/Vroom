
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import { connect } from 'react-redux'
import globalStore from './globalStore'

class Digest extends Component {
	constructor(props) {
		super(props)
	}

	getReleaseText() {
		return this.props.releaseNeededPenalties.length == 0 ?
				'No Releases Needed' :
				'RELEASES'
	}

	getReleaseNumbers() {
		return this.props.releaseNeededPenalties.join(', ')
	}

	render() {
		return (
			<View style={styles.digestWrapper}>
				<Text style={[styles.digestTitle, this.props.releaseNeededPenalties.length == 0 ? styles.unhidden : styles.warning]}>{this.getReleaseText()}</Text>
				<Text style={[styles.digestContent, this.props.releaseNeededPenalties.length == 0 ? styles.hidden : styles.unhidden]}>{this.getReleaseNumbers()}</Text>
			</View>
		)
	}


}

class PenaltiesDigest extends Component{
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<View style={styles.mainContainer}>
				<Digest style={styles.digestContainer} teamNumber='0' releaseNeededPenalties={this.props.releaseNeededPenalties[0]}/>
				<Digest style={styles.digestContainer} teamNumber='1' releaseNeededPenalties={this.props.releaseNeededPenalties[1]}/>
			</View>
		)
	}
}


const mapStateToProps = (state) => {
  return {
    releaseNeededPenalties: state.penaltiesState.penalties,
    timeInMilliseconds: state.timerState.timeInMilliseconds
  }
}

export default connect(mapStateToProps)(PenaltiesDigest)

const styles = StyleSheet.create({
	mainContainer: {
		flexDirection: 'row',
		paddingTop: 5,
		paddingBottom: 5
	},
	hidden : {
		height: 0,
		opacity: 0
	},
	digestContainer: {
		flex: 1
	},
	digestWrapper: {
		flex: 1,
		marginLeft: 5,
		marginRight: 5
	},
	warning: {
		fontWeight: 'bold'
	},
	digestTitle: {
		flex: 1,
		textAlign: 'center'
	},
	digestContent: {
		flex: 1,
		textAlign: 'center'
	}
})