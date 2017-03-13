import React from 'react'
import ReactDOM from 'react-dom'
import Mui from './mui/Mui'
import Calculator from './calculator/Calculator'
import StateUpApp from './stateup/StateUpApp'

const App = () => (
  <div>
    <h2>Component Mui</h2>
    <Mui />
    <h2>Component Calculator</h2>
    <Calculator />
    <h2>Component StateUpApp</h2>
    <StateUpApp />
  </div>
)

const app = document.createElement('div')
document.body.appendChild(app)
ReactDOM.render(<App />, app)
