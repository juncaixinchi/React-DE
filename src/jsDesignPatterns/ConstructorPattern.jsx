import React from 'react'

export default class ConstructorPattern extends React.Component {
  extend = (obj, extension) => {
    for (const key in extension) {
      obj[key] = extension[key]
    }
  }
  addNewObserver = () => {
    const check = document.createElement('input')
    check.type = 'checkbox'
    this.extend(check, new Observer())
    check.update = function (value) {
      this.checked = value
    }
    controlCheckbox.addObserver(check)
    container.appendChild(check)
  }
  ob = () => {
    const controlCheckbox = document.getElementById('mainCheckbox')
    const container = document.getElementById('observersContainer')

    this.extend(controlCheckbox, new Subject())

    controlCheckbox.onclick = function () {
      controlCheckbox.notify(controlCheckbox.checked)
    }
  }
  render() {
    function Observer() {
      this.update = function () {}
    }

    function ObserverList() {
      this.observerList = [1, 2]
    }

    ObserverList.prototype.add = function (obj) {
      return this.observerList.push(obj)
    }

    ObserverList.prototype.count = function () {
      return this.observerList.length
    }

    ObserverList.prototype.get = function (index) {
      if (index > -1 && index < this.observerList.length) {
        return this.observerList[index]
      }
    }

    ObserverList.prototype.indexOf = function (obj, startIndex) {
      let i = startIndex

      while (i < this.observerList.length) {
        if (this.observerList[i] === obj) {
          return i
        }
        i++
      }

      return -1
    }

    ObserverList.prototype.removeAt = function (index) {
      this.observerList.splice(index, 1)
    }

    console.log(ObserverList.prototype)

    function Subject() {
      this.observers = new ObserverList()
    }

    Subject.prototype.addObserver = function (observer) {
      this.observers.add(observer)
    }

    Subject.prototype.removeObserver = function (observer) {
      this.observers.removeAt(this.observers.indexOf(observer, 0))
    }

    Subject.prototype.notify = function (context) {
      const observerCount = this.observers.count()
      for (let i = 0; i < observerCount; i++) {
        this.observers.get(i).update(context)
      }
    }

    return (
      <div>
        <button onClick={this.addNewObserver}>Add New Observer checkbox</button>
        <input id="mainCheckbox" type="checkbox" />
        <div id="observersContainer" />
        hello world ~
        <button onClick={this.ob}>Add New Observer checkbox</button>
      </div>
    )
  }
}
