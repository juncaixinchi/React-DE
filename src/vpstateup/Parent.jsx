import React from 'react'
import Composite from './Composite'
import StateUp from './VPStatUp'

export default class VpStateUp extends StateUp(React.Component) {

  constructor() {
    super()
    this.state = { state: new Composite.State() }
  }

  render() {
    return <Composite {...this.bindVState('state')} />
  }
}

