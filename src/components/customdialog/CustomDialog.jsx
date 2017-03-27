import React from 'react'
import keycode from 'keycode'
import EventListener from 'react-event-listener'
import { Dialog, FlatButton, Toggle, RaisedButton } from 'material-ui'
import CDialog from './CDialog'
import { CatSilhouette, BallOfYarn, Account, ReportProblem, HDDIcon, RAIDIcon, UpIcon, DownIcon
} from '../mui/svg'

const VerticalExpandable = props => (
  <div style={{ width: '100%', height: props.height, transition: 'height 300ms', overflow: 'hidden' }}>
    { props.children }
  </div>
)


export default class CustomDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      triggle: 0,
      expanded: false,
      mui: false
    }
    this.handleKeyUp = (event) => {
      switch (keycode(event)) {
        case 'o': return this.setState({ open: !this.state.open })
        case 'm': return this.setState({ mui: !this.state.mui })
        case 'p': return this.setState({ triggle: this.state.triggle + 1 })
        default: return 0
      }
    }

    this.MuiCompo = () => (
      <div className="container">
        <div>
          <span>以下是两个Material UI</span>
          <br />
          <CatSilhouette />
          <Toggle />
        </div>
      </div>
    )
    this.MuiCompoCopy = () => {
      const allcat = []
      // for (let i = 1; i < this.state.triggle*10; i++) {
      for (let i = 1; i <= this.state.triggle; i++) {
        allcat.push(
          <div key={i.toString()}>
            <CatSilhouette />
          </div>
        )
      }
      return allcat
    }
  }
  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }
  handleTriggle = () => {
    this.setState({ triggle: this.state.triggle + 1 })
  }
  render() {
    return (
      <div>
        <EventListener target="window" onKeyUp={this.handleKeyUp} />
        The actions in this window were passed in as an array of React objects.
        <RaisedButton label="CustomDialog" onTouchTap={this.handleOpen} />
        <RaisedButton label="triggle" onTouchTap={this.handleTriggle} />
        <CDialog
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div style={{ overflow: 'hidden', width: 300, padding: 24 }}>
            <VerticalExpandable height={this.state.expanded ? 500 : 50}>
              my puredialog
              <RaisedButton label="expand" onTouchTap={() => this.setState({ expanded: !this.state.expanded })} />
              {this.MuiCompoCopy()}
            </VerticalExpandable>
          </div>
        </CDialog>
        <Dialog
          open={this.state.mui}
          onRequestClose={() => this.setState({ mui: false })}
        >
          muiDialog
          {this.MuiCompoCopy()}
        </Dialog>
      </div>
    )
  }
}
