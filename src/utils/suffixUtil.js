
export default {
  getSuffix (filename) {
    if (/\.([a-zA-Z0-9]+?)$/.test(filename)) {
      return RegExp.$1
    } else {
      return ''
    }
  }
}

