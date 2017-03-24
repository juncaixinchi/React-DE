import React from 'react'
import { Dialog, FlatButton, Toggle, RaisedButton } from 'material-ui'
import { CatSilhouette, BallOfYarn, Account, ReportProblem, HDDIcon, RAIDIcon, UpIcon, DownIcon
} from './components/mui/svg'


export default class CustomDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      triggle: 0
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
  }
  MuiCompoCopy = () => {
    const allcat = []
    for (let i = 1; i < 20; i++) {
      allcat.push(
        <div>
          <CatSilhouette />
        </div>
          )
    }
    return allcat
  }
  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }
  handleTriggle = () => {
    setTimeout(() =>
    this.setState({
      triggle: this.state.triggle + 1
    }), 3000)
  }
  render() {
    const mydialogshell = () => (
      <div>
        <div
          style={{
            position: 'fixed',
            zIndex: 1500,
            top: 0,
            left: -10000,
            width: '100%',
            height: '100%',
            transition: 'left 0ms cubic-bezier(0.23, 1, 0.32, 1) 450ms'
          }}
        >
          <div />
          <div
            style={{
              position: 'fixed',
              height: '100%',
              width: '100%',
              top: 0,
              left: '-100%',
              opacity: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.541176)',
              willChange: 'opacity',
              transform: 'translateZ(0px)',
              transition: 'left 0ms cubic-bezier(0.23, 1, 0.32, 1) 400ms, opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
              zIndex: 1400
            }}
          >
            react-empty
          </div>
        </div>
      </div>
    )
    const mydialog = () => (
      <div>
        <div
          dataReactroot
          style={{ position: 'fixed',
            boxSizing: 'border-box',
            zIndex: 1500,
            top: 0,
            left: this.state.triggle === 2 ? 0 : -1000,
            width: '100%',
            height: '100%',
            transition: 'left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
            paddingTop: '395px' }}
        >
            react-empty: 5
            <div>
              <div
                style={{
                  boxSizing: 'border-box',
                  transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                  position: 'relative',
                  width: '75%',
                  maxWidth: '768px',
                  margin: '0px auto',
                  zIndex: 1500,
                  opacity: 1,
                  transform: 'translate(0px, 64px)' }}
              >
                <div
                  style={{
                    color: 'rgba(0, 0, 0, 0.870588)',
                    backgroundColor: 'rgb(255, 255, 255)',
                    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                    boxSizing: 'border-box',
                    fontFamily: 'Roboto, sans-serif',
                    boxShadow: 'rgba(0, 0, 0, 0.247059) 0px 14px 45px, rgba(0, 0, 0, 0.219608) 0px 10px 18px',
                    borderRadius: '2px' }}
                >
                  <div
                    style={{ fontSize: '16px',
                      color: 'rgba(0, 0, 0, 0.6)',
                      padding: '24px',
                      boxSizing: 'border-box',
                      overflowY: 'hidden',
                      maxHeight: '838px' }}
                  >
                    hello
                  </div>
                </div>
              </div>
            </div>
          <div
            style={{
              position: 'fixed',
              height: '100%',
              width: '100%',
              top: '0px',
              left: this.state.triggle === 2 ? 0 : -1000,
              opacity: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.541176)',
              willChange: 'opacity',
              transform: 'translateZ(0px)',
              transition: 'left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
              zIndex: 1400 }}
          >
              react-empty-all
          </div>
        </div>
      </div>
    )
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
        onTouchTap={this.handleClose}
      />
    ]
    return (
      <div>
        The actions in this window were passed in as an array of React objects.
        {/*
        <div>
          <RaisedButton label="Dialog" onTouchTap={this.handleOpen} />
          <Dialog
            title="Dialog With Actions"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            The actions in this window were passed in as an array of React objects.
          </Dialog>
        </div>
        */}
        <div>
          <RaisedButton label="CustomDialog" onTouchTap={this.handleOpen} />
          <RaisedButton label="triggle" onTouchTap={this.handleTriggle} />
          <Dialog
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            {this.state.triggle % 4 === 0 ? <Toggle /> : <div />}
            {this.state.triggle % 4 === 1 ? this.MuiCompoCopy() : <div />}
            {this.state.triggle % 4 === 2 ? <CatSilhouette /> : <div />}
            {this.state.triggle % 4 === 3 ? this.MuiCompo() : <div />}
          </Dialog>
        </div>
      </div>
    )
  }
}
