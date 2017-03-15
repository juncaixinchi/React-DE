import React from 'react'
import Sub from './Sub'
import StateUp from '../common/StateUp' 

export default class Composite extends StateUp(React.Component) {

  constructor() {
    super()
    this.state = {
      sub1: new Sub.State(),
      sub2: new Sub.State()
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
        >
          reset
        </button>
      </div>
    )
  }
}
