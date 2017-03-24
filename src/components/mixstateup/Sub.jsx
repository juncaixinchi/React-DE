import React from 'react'

export default class Sub extends React.PureComponent {

  static State = class State {
    constructor() {
      this.label = ''
    }
  }

  render() {
    return (
      <div>
        <button
          style={{ width: 64, height: 24 }}
          onClick={() => this.props.setState({ label: `${this.props.state.label}a` })}
        >
          {this.props.state.label}
        </button>
      </div>
    )
  }
}
