import React from 'react'
import TemperatureInput from './TemperatureInput'


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
