import UiComponents from '../ui-components'
import Icon from '../icon'

/**
 * 进度条
 */
export default class Progress extends UiComponents {
  constructor (theme, name, suffix, size) {
    super(theme)
    this.progressbar = new ProgressBar(theme, name, suffix, size)
    this.progressbg = new ProgressBg(theme)
    let children = []
    children.push(this.progressbar.getEl())
    children.push(this.progressbg.getEl())
    this.el = this.h(`div.${this.theme}-progress`, children)
  }
  setProgress (p) {
    this.progressbg.setProgress(p)
  }
}

/**
 * 进度条
 */
class ProgressBar extends UiComponents {
  constructor (theme, name, suffix, size) {
    super(theme)
    this.icon = new Icon(theme, suffix, 36, 36, `${this.theme}-icon-suffix`)
    this.name = this.h(`span.${this.theme}-progress-filename`, name)
    this.size = new FileSizeEl(theme, size)
    this.ptools = new ProgressTools(theme)
    this.el = this.h(`div.${this.theme}-progress-bar`, [
      this.icon.getEl(),
      this.name,
      this.size.getEl(),
      this.ptools.getEl()
    ])
  }
}

/**
 * 进度条背景色
 */
class ProgressBg extends UiComponents {
  constructor (theme) {
    super(theme)
    this.el = this.h(`div.${this.theme}-progress-bg`)
  }
  setProgress (p) {
    let el = this.h(`div.${this.theme}-progress-bg.uploading`, {
      style: {
        width: p
      }
    })
    this.patch(this.el, el)
    this.el = el
  }
}

/**
 * 文件大小
 */
class FileSizeEl extends UiComponents {
  constructor (theme, size) {
    super(theme)
    this.el = this.h(`div.${this.theme}-progress-filesize`, calcSize(size))
  }
}

const DW = ['B', 'K', 'M', 'G', 'T']
function calcSize (size) {
  let d = 0
  while (size > 1024) {
    size = size / 1024
    d++
  }
  // 如果是1位就取一位小数，否则直接四舍五入
  if (size < 10) {
    size = size.toFixed(1)
  }
  else {
    size = Math.round(size)
  }
  return size + DW[d]
}

/**
 * 进度工具
 */
class ProgressTools extends UiComponents {
  constructor (theme) {
    super(theme)
    this.closeEl = this.createCloseIcon()
    this.pauseEl = this.createPauseIcon()
    this.startEl = this.createStartIcon()
    this.el = this.h(`div.${this.theme}-progress-tools`, [this.pauseEl, this.closeEl])
  }
  createCloseIcon () {
    let icon = new Icon(this.theme, 'close', 14, 14, `${this.theme}-icon-close`)
    return this.h(`span.${this.theme}-tool-close`, [ icon.getEl() ])
  }
  createPauseIcon () {
    let icon = new Icon(this.theme, 'zanting', 14, 14, `${this.theme}-icon-pause`)
    return this.h(`span.${this.theme}-tool-pause`, {
      on: {
        click: this.pauseUpload.bind(this)
      }
    }, [ icon.getEl() ])
  }
  createStartIcon () {
    let icon = new Icon(this.theme, 'jixu', 14, 14, `${this.theme}-icon-pause`)
    return this.h(`span.${this.theme}-tool-pause`, {
      on: {
        click: this.startUpload.bind(this)
      }
    }, [icon.getEl()])
  }
  pauseUpload () {
    let newEl = this.h(`div.${this.theme}-progress-tools`, [this.startEl, this.closeEl])
    this.patch(this.el, newEl)
    this.el = newEl
  }
  startUpload () {
    let newEl = this.h(`div.${this.theme}-progress-tools`, [this.pauseEl, this.closeEl])
    this.patch(this.el, newEl)
    this.el = newEl
  }
}
