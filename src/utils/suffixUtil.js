
export default {
  getSuffix (filename) {
    if (/\.([a-zA-Z]+?)$/.test(filename)) {
      return RegExp.$1
    } else {
      return ''
    }
  }
}

