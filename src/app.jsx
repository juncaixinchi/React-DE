import React from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
// import '../public/assets/font.css'

import TestFont from './components/testFont/TestFont'

// required by Material UI
injectTapEventPlugin()

const App = () => (
  <MuiThemeProvider>
    <div>
      <div>
        <TestFont />
      </div>
    </div>
  </MuiThemeProvider>
)

const app = document.createElement('div')
document.body.appendChild(app)
ReactDOM.render(<App />, app)
