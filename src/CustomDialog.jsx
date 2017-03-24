import React from 'react'
import { FlatButton, Toggle, RaisedButton } from 'material-ui'
import Dialog from './CDialog'
import { CatSilhouette, BallOfYarn, Account, ReportProblem, HDDIcon, RAIDIcon, UpIcon, DownIcon
} from './components/mui/svg'

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
      expanded: false
    }
    this.toggleExpanded = () => {
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
      for (let i = 1; i < 10; i++) {
        allcat.push(
          <div>
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
    setTimeout(() => {
      this.setState({
        triggle: this.state.triggle + 1
      })
      // this.handleTriggle()
    }, 2000)
  }
  render() {
    return (
      <div>
        The actions in this window were passed in as an array of React objects.
        <RaisedButton label="CustomDialog" onTouchTap={this.handleOpen} />
        <RaisedButton label="triggle" onTouchTap={this.handleTriggle} />
        <Dialog
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <VerticalExpandable height={this.state.expanded ? 500 : 50}>
            <RaisedButton label="expand" onTouchTap={() => this.setState({ expanded: !this.state.expanded })} />
            <div style={{ height: 200, overflow: 'hidden' }}>
              lalala
              {this.MuiCompoCopy()}
            </div>
          </VerticalExpandable>
        </Dialog>
      </div>
    )
  }
}
