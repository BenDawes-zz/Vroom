const styles = {
  light: {
    globalBackgroundColor: '#daeff4',
    globalBorderColor: '#76c3d6',
    lightHighlightColor: '#ebf6f9',
    mediumHighlightColor: '#9dd4e2',
    darkHighlightColor: '#2f879d'
  },
  dark: {
    globalBackgroundColor: '#02278a'
  }
}

const initialStyleState = styles.light

export default StyleReducer = (state = initialStyleState, action = {}) => {
  switch (action.type) {
    case 'CHOOSE_STYLE': {
      return styles[action.styleName]
    }
    default: 
      return state
  }
}