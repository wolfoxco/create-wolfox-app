import { app as program } from 'hyperapp'
import h from 'hyperapp-style' // eslint-disable-line
import normalize from './styles/normalize'
import foundations from './styles/foundations'

const state = {}

const actions = {
  messaging: {
    down: value => state => ({ value: state.value - value }),
    up: value => state => ({ value: state.value + value })
  }
}

const view = (state, actions) => (
  <div id='app' style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    widths: [{
      max: '600px',
      backgroundColor: 'green'
    }, {
      min: '200px',
      backgroundColor: 'blue'
    }],
    mobile: {
      color: 'red'
    },
    hover: {
      backgroundColor: 'red'
    }
  }}>
    Hello World from HyperApp
  </div>
)

function onceLoaded() {
  return new Promise(resolve =>
    window.addEventListener('DOMContentLoaded', () => resolve())
  )
}

function init() {
  const stylesheets = document.getElementsByTagName('style')
  if (stylesheets.length === 0) {
    const head = document.getElementsByTagName('head')[0]
    if (head) {
      const normalizeStylesheet = normalize()
      const foundationsStylesheet = foundations()
      head.appendChild(normalizeStylesheet)
      head.appendChild(foundationsStylesheet)
    }
  }
  return true
}

function activateDevTools() {
  if (process.env.NODE_ENV !== 'production') { // eslint-disable-line
    return import('hyperapp-redux-devtools')
      .then(({ default: devtools }) =>
        devtools(program)(state, actions, view, document.body)
      )
  } else {
    return Promise.resolve(
      program(state, actions, view, document.body)
    )
  }
}

function main() {
  return onceLoaded()
    .then(init)
    .then(activateDevTools)
    .then(console.log('Program Launched'))
    .catch(error => console.error(error))
}

main()
