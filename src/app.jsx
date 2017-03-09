import React from 'react'
import ReactDOM from 'react-dom'
import Mui from './Mui'
import Calculator from './Calculator'

const App = () => (
  <div>
    <Mui />
    <Calculator />
  </div>
)

const app = document.createElement('div')
document.body.appendChild(app)
ReactDOM.render(<App />, app)
