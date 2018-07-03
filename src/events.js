export default function Events () {
  this.listeners = {}
}
Events.prototype.on = function (key, fn) {
  if (Object.prototype.toString.call(fn) !== '[object Function]') {
    return
  }
  if (!this.listeners[key]) {
    this.listeners[key] = []
  }
  let listeners = this.listeners[key]
  let index = listeners.indexOf(fn)
  if (index !== -1) {
    listeners[index] = fn
  } else {
    listeners.push(fn)
  }
}

Events.prototype.trigger = function (key, ...args) {
  let fns = this.listeners[key]
  if (fns && fns.length > 0) {
    fns.forEach(fn => {
      fn.apply(null, args)
    })
  }
}

Events.prototype.remove = function (key, fn) {
  let fns = this.listeners[key]
  if (fns && fns.length > 0) {
    let index = fns.indexOf(fn)
    if (index !== -1) {
      return fns.splice(index, 1)
    }
  }
}

