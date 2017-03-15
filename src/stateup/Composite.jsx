import React from 'react'
import Sub from './Sub'
import StateUp from '../common/StateUp'

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
        1. <Sub {...this.bindVState('sub1')} />
        2. <Sub {...this.bindVState('sub1')} />
        3. <Sub {...this.bindVState('sub2')} />
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
