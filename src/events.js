
const fn = function () {}

export default class Events {
  constructor () {
    // todo: 目前重复监听事件会被覆盖，为了方便做事件销毁。以后可以改成允许使用重复事件触发。
    this.listeners = {
      start: fn,
      progress: fn,
      error: fn,
      success: fn,
      end: fn
    }
  }
  on (key, fn) {
    if (typeof key === 'string' && typeof fn === 'function') {
      this.listeners[key] = fn
    }
  }
  trigger (key, ...arg) {
    this.listeners[key] && this.listeners[key](...arg)
  }
  remove (key) {
    if (typeof key === 'string' && this.listeners[key]) {
      this.listeners[key] = fn
    }
  }
}
