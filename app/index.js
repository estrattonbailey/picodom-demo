/** @jsx h */
import { h, patch, mount } from 'picodom'
import Counter from './Counter.js'

let root
let state = {
  title: 'Home',
  location: '/'
}

function Home (props) {
  return (
    <div>
      <h1>{props.title}</h1>

      <Counter />
    </div>
  )
}

function About (props) {
  return (
    <div>
      <h1>{props.title}</h1>
    </div>
  )
}

function App (props) {
  const content = props.location === '/' ? <Home /> : <About />
  return (
    <div>
      <button onclick={e => update({ location: '/' })}>Home</button>
      <button onclick={e => update({ location: '/about' })}>About</button>

      {content}
    </div>
  )
}

function update (newState) {
  state = Object.assign(state, newState)

  patch(root, (root = <App {...state} />))
}

mount(document.getElementById('root'), (root = <App {...state} />))

/**
 * Enable hot reloading for all subsequent modules
 */
if (module.hot && process && process.env.NODE_ENV !== 'production') {
  module.hot.accept()
}
