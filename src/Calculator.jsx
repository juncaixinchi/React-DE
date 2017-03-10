import React from 'react'
import TemperatureInput from './TemperatureInput'

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


const BoilingVerdict = (props) => {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>
  }
  return <p>The water would not boil.</p>
}

const toCelsius = fahrenheit => (fahrenheit - 32) * 5 / 9

const toFahrenheit = celsius => (celsius * 9 / 5) + 32

const tryConvert = (value, convert) => {
  const input = parseFloat(value)
  if (Number.isNaN(input)) {
    return ''
  }
  const output = convert(input)
  const rounded = Math.round(output * 1000) / 1000
  return rounded.toString()
}

export default class Calculator extends React.Component {
  constructor(props) {
    super(props)
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this)
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this)
    this.state = { value: '', scale: 'c' }
  }

  handleCelsiusChange(value) {
    this.setState({ scale: 'c', value })
  }

  handleFahrenheitChange(value) {
    this.setState({ scale: 'f', value })
  }

  render() {
    const scale = this.state.scale
    const value = this.state.value
    const celsius = scale === 'f' ? tryConvert(value, toCelsius) : value
    const fahrenheit = scale === 'c' ? tryConvert(value, toFahrenheit) : value

    return (
      <div>
        <TemperatureInput
          scale="c"
          value={celsius}
          onChange={this.handleCelsiusChange}
        />
        <TemperatureInput
          scale="f"
          value={fahrenheit}
          onChange={this.handleFahrenheitChange}
        />
        <BoilingVerdict
          celsius={parseFloat(celsius)}
        />
      </div>
    )
  }
}
