import React from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

import Mui from './mui/Mui'
import Calculator from './calculator/Calculator'
import StateUpApp from './stateup/StateUpApp'
import Composite from './twostateup/Composite'
import Deskmark from './Deskmark/Deskmark'
import VpStateUp from './vpstateup/Parent'
import MixStateUp from './mixstateup/Parent'

// required by Material UI
injectTapEventPlugin()

const App = () => (
  <MuiThemeProvider>
    <div>
      <div>
        <h2>Component MixStateUp</h2>
        <MixStateUp />
        <h2>Component TwoStateUpApp with Material-ui</h2>
        <Composite />
      </div>
      <div style={{ display: 'none' }}>
        <h2>Component Vpstateup</h2>
        <VpStateUp />
        <h2>Component Deskmark</h2>
        <Deskmark />
        <h2>Component Mui</h2>
        <Mui />
        <h2>Component Calculator</h2>
        <Calculator />
        <h2>Component StateUpApp</h2>
        <StateUpApp />
      </div>
    </div>
  </MuiThemeProvider>
)

const app = document.createElement('div')
document.body.appendChild(app)
ReactDOM.render(<App />, app)
