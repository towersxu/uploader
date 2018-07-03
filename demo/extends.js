class Events {
  constructor() {
    this.listeners = {}
  }
  on (key, fn) {
    if (Object.prototype.toString.call(fn) !== '[object Function]') {
      return
    }
    if (!this.listeners[key]) {
      this.listeners[key] = []
    }
    let index = this.listeners[key].indexOf(fn)
    if (index !== -1) {
      this.listeners[index] = fn
    }
    else {
      this.listeners[key].push(fn)
    }
  }
  trigger (key, ...args) {
    let fns = this.listeners[key]
    if (fns.length > 0) {
      fns.forEach(fn => {
        fn.apply(null, args)
      })
    }
  }
  remove (key, fn) {
    let fns = this.listeners[key]
    if (fns.length > 0) {
      let index = fns.indexOf(fn)
      if (index !== -1) {
        return fns.splice(index, 1)
      }
    }
  }
}

class Ui {
  constructor (el) {
    this.el = el
  }
  // todo: 不兼容IE9的话，可以考虑用classList
  addClass (cls) {
    let className = this.el.className
    if (className) {
      let names = className.split(' ')
      if (names.indexOf(cls) === -1) {
        this.el.className = names.push(cls).join(' ')
      }
    }
    else {
      this.el.className = cls
    }
  }
  removeClass (cls) {
    let className = this.el.className
    if (className) {
      let names = className.split(' ')
      let index = names.indexOf(cls)
      if (index !== -1) {
        names.splice(index, 1)
        this.el.className = names.join(' ')
      }
    }
  }
}

class Element extends Ui {
  constructor (el) {
    super(el)
  }
}

var el = document.getElementById('el')
var ele = new Element(el)
ele.addClass('name')