import errorinfo from './assets/i18n/cn.js'
export default {
  error (msg) {
    msg = errorinfo[msg] || msg
    throw new Error(msg)
  },
  log (msg) {
    if (console && console.log) {
      console.log(msg)
    }
  }
}
