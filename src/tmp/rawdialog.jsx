import React from 'react'
import EventListener from 'react-event-listener'
import keycode from 'keycode'
import { Dialog, Paper } from 'material-ui'

export default class CDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      muidialogopen: false
    }
  }

  componentDidMount() {
    this.positionDialog()
  }

  componentDidUpdate() {
    this.positionDialog()
  }

  positionDialog = () => {
    if (!this.props.open) return

    const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    const dialogWindow = this.nodeDialogWindow
    const dialogContent = this.nodeDialogContent
    const minPaddingTop = 16
    const dialogContentHeight = dialogContent.offsetHeight

    dialogContent.style.height = ''
    dialogWindow.style.height = ''

    let paddingTop = ((clientHeight - dialogContentHeight) / 2) - 64
    if (paddingTop < minPaddingTop) paddingTop = minPaddingTop
    dialogWindow.style.paddingTop = `${paddingTop}px`
  }

  requestClose = (buttonClicked) => {
    if (buttonClicked && !this.props.modal) return

    if (this.props.onRequestClose) {
      this.props.onRequestClose(!!buttonClicked)
    }
  }

  handleTouchTapOverlay = () => {
    this.requestClose(false)
  }

  handleKeyUp = (event) => {
    if (keycode(event) === 'esc') {
      this.requestClose(false)
    }
    if (keycode(event) === 'up') {
      this.setState({
        muidialogopen: !this.state.muidialogopen
      })
    }
  }
  handleResize = () => {
    this.positionDialog()
  }

  renderContent = () => (
    <div
      ref={node => (this.nodeDialogWindow = node)}
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        top: 0,
        left: this.props.open ? 0 : '-100%',
        zIndex: 1500,
        backgroundColor: 'none',
        transition: `left 0ms cubic-bezier(0.23, 1, 0.32, 1) ${this.props.open ? '0ms' : '450ms'}`
      }}
    >
      <div
        ref={node => (this.nodeDialogContent = node)}
        style={{
          position: 'relative',
          zIndex: 1500,
          width: '75%',
          maxWidth: '768px',
          margin: '0 auto',
          transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
          opacity: this.props.open ? 1 : 0,
          transform: this.props.open ? 'translate(0px, 64px)' : 'translate(0px, 0px)'
        }}
      >

        <div
          style={{
            position: 'fixed',
            zIndex: 1500,
            width: '100%',
            maxWidth: '768px',
            color: 'rgba(0, 0, 0, 0.870588)',
            backgroundColor: 'rgb(255, 255, 255)',
            boxSizing: 'border-box',
            boxShadow: 'rgba(0, 0, 0, 0.247059) 0px 14px 45px, rgba(0, 0, 0, 0.219608) 0px 10px 18px',
            borderRadius: '2px'
          }}
        >
          <Paper zDepth={4}>
            {this.props.children}
          </Paper>
        </div>
      </div>
      <div
        style={{
          position: 'fixed',
          height: '100%',
          width: '100%',
          top: 0,
          left: this.props.open ? 0 : '-100%',
          opacity: this.props.open ? 1 : 0,
          backgroundColor: 'rgba(0, 0, 0, 0.541176)',
          willChange: 'opacity',
          transform: 'translateZ(0px)',
          transition: `left 0ms cubic-bezier(0.23, 1, 0.32, 1) ${this.props.open ? '0ms' : '400ms'},
              opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms`,
          zIndex: 1400
        }}
        onTouchTap={this.handleTouchTapOverlay}
      />
    </div>
    )

  render() {
    return (
      <div>
        <EventListener
          target="window"
          onKeyUp={this.handleKeyUp}
          onResize={this.handleResize}
        />
        {this.renderContent()}
        <Dialog
          open={this.state.muidialogopen}
        >
          hello
        </Dialog>
      </div>
    )
  }
}
