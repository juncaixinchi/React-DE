import React from 'react'
import { Toggle } from 'material-ui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { CatSilhouette, BallOfYarn, Account, ReportProblem, HDDIcon, RAIDIcon, UpIcon, DownIcon
} from './svg'

@muiThemeable()
export default class Mui extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    const primary1Color = this.props.muiTheme.palette.primary1Color
    this.MuiCompo = () => (
      <div className="container">
        <div>
          <span style={{ color: primary1Color }}>以下是两个Material UI</span>
          <br/>
          <CatSilhouette />
          <Toggle />
        </div>
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
