import React from 'react'
import Composite from './Composite'

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

class Stateful extends StateUp(React.Component) {
  constructor(props) {
    super()
    this.state = { state: new props.component.State() }
  }

  render() {
    const Component = this.props.component
    return <Component {...this.stateBinding('state')} />
  }
}

export default class StateUpApp extends React.Component {
  render() {
    return <Stateful component={Composite} />
  }
}
