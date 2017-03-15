import React from 'react'
import { Sub, SubState } from './Subs'
import StateUp from '../common/StateUp'

export default class Composite extends StateUp(React.Component) {

  constructor() {
    super()
    console.log(`Sub ${Sub}`)
    // console.log(`Sub.prototype ${Sub.prototype}`)
    // console.log(`Sub.prototype.creatPstate ${Sub.prototype.creatPstate}`)
    this.state = {
      sub1: new SubState(),
      sub2: new SubState()
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
