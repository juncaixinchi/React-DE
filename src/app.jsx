import React from 'react'
import ReactDOM from 'react-dom'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'

import Mui from './mui/Mui'
import Calculator from './calculator/Calculator'
import StateUpApp from './stateup/StateUpApp'
import Composite from './twostateup/Composite'

global.theme = Object.assign({}, getMuiTheme(lightBaseTheme), { fontFamily: 'Noto Sans SC, sans-serif' })
const App = () => (
  <MuiThemeProvider muiTheme={theme}>
    <div>
      <h2>Component Mui</h2>
      <Mui />
      <h2>Component Calculator</h2>
      <Calculator />
      <h2>Component StateUpApp</h2>
      <StateUpApp />
      <h2>Component TwoStateUpApp</h2>
      <Composite />
    </div>
  </MuiThemeProvider>
)

const app = document.createElement('div')
document.body.appendChild(app)
ReactDOM.render(<App />, app)
