import React from 'react'
import { Toggle } from 'material-ui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { CatSilhouette, BallOfYarn, Account, ReportProblem, HDDIcon, RAIDIcon, UpIcon, DownIcon
} from './svg'

export default class Mui extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    this.MuiCompo = () => (
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
  }

  render() {
    return (
      <div>
        {this.MuiCompo()}
      </div>
    )
  }
}

