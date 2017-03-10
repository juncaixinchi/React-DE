import React from 'react'
import ReactDOM from 'react-dom'
import Mui from './Mui'
import Calculator from './Calculator'

const App = () => (
  <div>
    <h2>Component Mui</h2>
    <Mui />
    <h2>Component Calculator</h2>
    <Calculator />
  </div>
)

const app = document.createElement('div')
document.body.appendChild(app)
ReactDOM.render(<App />, app)
