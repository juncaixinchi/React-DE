import React from 'react'
import ReactDOM from 'react-dom'
import { Toggle } from 'material-ui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { CatSilhouette, BallOfYarn, Account, ReportProblem, HDDIcon, RAIDIcon, UpIcon, DownIcon
} from './svg'

const App = () => (
  <div className="container">
    <MuiThemeProvider>
      <div>
        <h1>Hello React !</h1>
        <Toggle />
        <CatSilhouette />
      </div>
    </MuiThemeProvider>
  </div>
)

const app = document.createElement('div')
document.body.appendChild(app)
ReactDOM.render(<App />, app)
