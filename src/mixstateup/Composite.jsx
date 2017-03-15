import React from 'react'
import Sub from './Sub'
import StateUp from './MixStateUp'

export default class Composite extends StateUp(React.PureComponent) {
  static State = class State {
    constructor() {
      this.sub1 = new Sub.State()
      this.sub2 = new Sub.State()
    }
  }

  constructor() {
    super()
    this.state = { state: new Sub.State() }
  }

  render() {
    return (
      <div>
        <p>Button 1 and 2 share Pstate, and Button 3 has its own Pstate
          <br />
          Button 4 and 5 share Vstate
        </p>
        1. <Sub {...this.bindState('sub1')} /> {/* PState */}
        2. <Sub {...this.bindState('sub1')} /> {/* PState */}
        3. <Sub {...this.bindState('sub2')} /> {/* PState */}
        4. <Sub {...this.bindState('state', 1)} /> {/* VState */}
        5. <Sub {...this.bindState('state', 1)} /> {/* VState */}
        <br />
        <button
          onClick={() => this.props.setState({ sub1: new Sub.State(), sub2: new Sub.State() })}
        >
          reset Pstate
        </button>
        <button
          onClick={() => this.setState({ state: new Sub.State() })}
        >
          reset Vstate
        </button>
      </div>
    )
  }
}
