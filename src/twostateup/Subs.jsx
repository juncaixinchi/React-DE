import React from 'react'
import { Toggle } from 'material-ui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { CatSilhouette, BallOfYarn, Account, ReportProblem, HDDIcon, RAIDIcon, UpIcon, DownIcon
} from '../mui/svg'

export class SubState {
  constructor() {
    this.label = ''
  }
}

@muiThemeable()
export class Sub extends React.PureComponent {

  constructor() {
    super()
    this.MuiCompo = () => (
      <div className="container">
        <div>
          <CatSilhouette />
          <Toggle />
        </div>
      </div>
    )
  }
  CreatPstate() {
    return new SubState()
  }

  render() {
    const primary1Color = '#123FFF'
    // const primary1Color = this.props.muiTheme.palette.primary1Color
    return (
      <div>
        <button
          style={{ width: 64, height: 24 }}
          onClick={() => this.props.setState({ label: `${this.props.state.label}a` })}
        >
          {this.props.state.label}
        </button>
        <div>
          <span style={{ color: primary1Color }}>MuiCompo</span>
          {this.MuiCompo()}
        </div>
      </div>
    )
  }
}
