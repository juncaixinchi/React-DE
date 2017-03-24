import React from 'react'

const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
}

export default class TemperatureInput extends React.Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    this.props.onChange(e.target.value)
  }

  render() {
    const value = this.props.value
    const scale = this.props.scale
    return (
      <fieldset>
        <legend>Enter value in {scaleNames[scale]}:</legend>
        <input
          value={value}
          onChange={this.handleChange}
        />
      </fieldset>
    )
  }
}
