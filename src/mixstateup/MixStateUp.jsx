const status = {}

const StateUp = base => class extends base {

  setSubState(name, nextSubState) {
    const state = status[name] ? this.props.state : this.state
    const subState = state[name]
    const nextSubStateMerged = Object.assign(new subState.constructor(), subState, nextSubState)
    const nextState = { [name]: nextSubStateMerged }
    status[name] ? this.props.setState(nextState) : this.setState(nextState)
  }

  setSubStateBound(name) {
    const obj = this.setSubStateBoundObj || (this.setSubStateBoundObj = {})
    return obj[name] ? obj[name] : (obj[name] = this.setSubState.bind(this, name))
  }

  bindState(name, mixstatus) {
    status[name] = !mixstatus && this.props.state // mixstatus = true , set vstate force
    return {
      state: status[name] ? this.props.state[name] : this.state[name],
      setState: this.setSubStateBound(name)
    }
  }
}

export default StateUp
