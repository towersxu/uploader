import UiComponents from './ui-components'
import '../assets/fonts/iconfont.js'

const icons = ['avi', 'swf', 'wav', 'txt', 'rmvb', 'xls', 'mkv', 'psd', 'mpg', 'exe', 'gif', 'pdf', 'mp4', 'ppt', 'dll', 'png', 'mp3', 'html', 'jpg', 'doc', 'close', 'zanting', 'success', 'delete', 'pause', 'contine', 'jixu']

function getIconSuffix (suffix) {
  suffix = suffix.toLowerCase()
  if (icons.indexOf(suffix) !== -1) {
    return suffix
  }
  return 'othe'
}

export default class Icon extends UiComponents {
  constructor (theme, suffix, width = 36, height = 36, cls) {
    super(theme)
    suffix = getIconSuffix(suffix)
    let str = `span.${this.theme}-icon`
    if (cls) {
      str += `.${cls}`
    }
    this.el = this.h(str, [
      this.h('svg', {
        attrs: {
          'width': `${width}px`,
          'height': `${height}px`,
          'aria-hidden': 'true'
        }
      }, [
        this.h('use', {
          attrs: {
            'xlink:href': `#icon-${suffix}`
          }
        })
      ])
    ])
  }
}
