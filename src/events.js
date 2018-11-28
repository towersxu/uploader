export default function Events () {
  this.listeners = {}
}

let commonListenrs = {}

/**
 * 监听事件
 */
Events.prototype.on = function (key, fn) {
  on(this.listeners, key, fn)
}

/**
 * 监听公共事件，就算是不同的event对象，也能通信
 */
Events.on = function (key, fn) {
  on(commonListenrs, key, fn)
}

/**
 * 触发监听事件
 */
Events.prototype.trigger = function (key, ...args) {
  trigger(this.listeners, key, ...args)
}
/**
 * 触发公共事件
 */
Events.trigger = function (key, ...args) {
  trigger(commonListenrs, key, ...args)
}
/**
 * 移除监听事件
 */
Events.prototype.remove = function (key, fn) {
  remove(this.listeners, key, fn)
}
/**
 * 移除公共事件
 */
Events.remove = function (key, fn) {
  remove(commonListenrs, key, fn)
}

function remove (listeners, key, fn) {
  let fns = listeners[key]
  if (fns && fns.length > 0) {
    let index = fns.indexOf(fn)
    if (index !== -1) {
      return fns.splice(index, 1)
    }
  }
}

function on(listeners, key, fn) {
  if (Object.prototype.toString.call(fn) !== '[object Function]') {
    return
  }
  let listener = listeners[key]
  if (!listener) {
    listener = []
    listeners[key] = listener
  }
  // 如果是同一个函数，则不必重复加入
  let index = listener.indexOf(fn)
  if (index === -1) {
    listener.push(fn)
  }
}

function trigger(listeners, key, ...args) {
  let fns = listeners[key]
  if (fns && fns.length > 0) {
    fns.forEach(fn => {
      fn.apply(null, args)
    })
  }
}
