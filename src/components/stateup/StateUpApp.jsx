import React from 'react'
import Composite from './Composite'
import StateUp from '../common/StateUp'

class Stateful extends StateUp(React.Component) {
  constructor(props) {
    super()
    this.state = { state: new props.component.State() }
  }

  render() {
    const Component = this.props.component
    return <Component {...this.bindVState('state')} />
  }
}

export default class StateUpApp extends React.Component {
  render() {
    return <Stateful component={Composite} />
  }
}
