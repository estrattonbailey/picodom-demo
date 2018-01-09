import { patch } from 'picodom'

class Component {
  constructor (config) {
    Object.assign(this, config)
    if (!this.state) {
      this.state = {}
    }
  }

  setState (fn) {
    Object.assign(
      this.state,
      typeof fn === 'function' ? fn(this.state) : fn
    )
    this._render()
  }

  _render () {
    patch(
      this._vref,
      (this._vref = this.render(this.props, this.state, this.children))
    )
  }
}

export default function component (config) {
  let comp = new Component(config)

  return function wrappedComponent (props, children) {
    if (!comp) comp =  new Component(config)

    if (!comp._vref) {
      comp.props = props
      comp.children = children
      comp.init(props)
      comp._vref = comp.render(comp.props, comp.state, children)
      Object.assign(comp._vref.props, {
        oncreate (el) {
          comp.ref = el
          comp.mount && comp.mount()
        },
        ondestroy () {
          comp.unmount && comp.unmount()
          comp = null
        }
      })
    }

    for (let key in props) {
      if (props[key] !== comp.props[key]) {
        comp.props = props

        if (!comp.update || comp.update(props, comp.state)) {
          comp._render()
        }
      }
    }

    return comp._vref
  }
}
