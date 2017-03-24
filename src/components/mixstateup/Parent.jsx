import React from 'react'
import Composite from './Composite'
import StateUp from './MixStateUp'

export default class VpStateUp extends StateUp(React.Component) {

  constructor() {
    super()
    this.state = { state: new Composite.State() }
  }

  render() {
    return <Composite {...this.bindState('state')} />
  }
}

