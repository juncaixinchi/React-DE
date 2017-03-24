import React, { PropTypes } from 'react'
import EventListener from 'react-event-listener'
import keycode from 'keycode'
import { Paper } from 'material-ui'

export default class CDialog extends React.Component {

  static propTypes = {
    modal: PropTypes.bool,
    onRequestClose: PropTypes.func,
    open: PropTypes.bool.isRequired
  }
  static defaultProps = {
    modal: false,
    onRequestClose: null
  }

  constructor(props) {
    super(props)

    this.requestClose = (buttonClicked) => {
      if (!buttonClicked && this.props.modal) return
      if (this.props.onRequestClose) {
        this.props.onRequestClose(!!buttonClicked)
      }
    }
    this.handleTouchTapOverlay = () => {
      this.requestClose(false)
    }

    this.handleKeyUp = (event) => {
      if (keycode(event) === 'esc') {
        this.requestClose(false)
      }
    }
  }

  render() {
    const {
      open
    } = this.props
    if (!open) return <div />
    return (
      <div
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 1500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: `left 0ms cubic-bezier(0.23, 1, 0.32, 1) ${open ? '0ms' : '450ms'}`
        }}
      >
        <div
          style={{
            zIndex: 1500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: `all 0ms cubic-bezier(0.23, 1, 0.32, 1) ${open ? '0ms' : '450ms'}`
          }}
        >
          <EventListener
            target="window"
            onKeyUp={this.handleKeyUp}
          />
          <Paper zDepth={4}>
            {this.props.children}
          </Paper>
        </div>
        <div
          style={{
            position: 'fixed',
            height: '100%',
            width: '100%',
            top: 0,
            left: open ? 0 : '-100%',
            opacity: open ? 1 : 0,
            backgroundColor: 'rgba(0, 0, 0, 0.541176)',
            willChange: 'opacity',
            transition: `left 0ms cubic-bezier(0.23, 1, 0.32, 1) ${open ? '0ms' : '400ms'},
            opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms`,
            zIndex: 1400
          }}
          onTouchTap={this.handleTouchTapOverlay}
        />
      </div>
    )
  }
}
