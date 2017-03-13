import React from 'react'
import Sub from './Sub'

const StateUp = base => class extends base {
  setSubState(name, nextSubState) {
    const state = this.props.state || this.state
    const subState = state[name]
    const nextSubStateMerged = Object.assign(new subState.constructor(), subState, nextSubState)
    const nextState = { [name]: nextSubStateMerged }
    this.props.setState
      ? this.props.setState(nextState)
      : this.setState(nextState)
  }

  setSubStateBound(name) {
    const obj = this.setSubStateBoundObj || (this.setSubStateBoundObj = {})
    return obj[name] ? obj[name] : (obj[name] = this.setSubState.bind(this, name))
  }

  stateBinding(name) {
    return {
      state: this.props.state ? this.props.state[name] : this.state[name],
      setState: this.setSubStateBound(name)
    }
  }
}


export default class Composite extends StateUp(React.PureComponent) {
  static State = class State {
    constructor() {
      this.sub1 = new Sub.State()
      this.sub2 = new Sub.State()
    }
  }

  render() {
    return (
      <div>
        <p>Button 1 and 2 share state, and Button 3 has its own state</p>
        1. <Sub {...this.stateBinding('sub1')} />
        2. <Sub {...this.stateBinding('sub1')} />
        3. <Sub {...this.stateBinding('sub2')} />
        <br />
        <button
          style={{ width: 64, height: 24 }}
          onClick={() => this.props.setState({ sub1: new Sub.State(), sub2: new Sub.State() })}
        >
          reset
        </button>
      </div>
    )
  }
}
