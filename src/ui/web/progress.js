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
  setProgress (p, loaded) {
    this.progressbg.setProgress(p)
    this.progressbar.setProgress(p, loaded)
  }
  setStatus (statu, data) {
    this.progressbar.setStatus(statu, data)
  }
}

/**
 * 进度条
 */
class ProgressBar extends UiComponents {
  constructor (theme, name, suffix, size) {
    super(theme)
    this.icon = new Icon(theme, suffix, 36, 36, `${this.theme}-icon-suffix`)
    this.name = name
    this.nameEle = this.h(`span.${this.theme}-progress-filename`, this.name)
    this.size = new FileSizeEl(theme, size)
    this.ptools = new ProgressTools(theme)
    this.el = this.h(`div.${this.theme}-progress-bar`, [
      this.icon.getEl(),
      this.nameEle,
      this.size.getEl(),
      this.ptools.getEl()
    ])
  }
  // 处理删除
  handlePTools () {
    this.ptools.on('pause', () => {
      console.log('pause')
    })
  }
  setStatus (statu, data) {
    if (statu === 'auth') {
      this.size.setStatus(1, '认证中')
    }
    this.ptools.setStatus(statu, data)
  }
  setProgress (p, loaded) {
    this.size.setStatus(2, loaded)
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
  constructor (theme, size, status) {
    super(theme)
    this.total = this.h(`span.${this.theme}-filesize-name`, calcSize(size))
    this.splitor = this.h('span', '/')
    this.p = this.h(`span.${this.theme}-status-tips`, '预处理中')
    this.el = this.h(`div.${this.theme}-progress-filesize`, [
      this.total,
      this.splitor,
      this.p
    ])
  }
  setProgress (size) {
    if (typeof size === 'number') {
      size = calcSize(size)
    }
    let el = this.h('span', size)
    this.patch(this.p, el)
    this.p = el
  }
  setStatus (type, text) {
    let el
    if (type === 1) {
      el = this.h(`span.${this.theme}-status-tips.${this.theme}-status-auth`, text)
    }
    else {
      el = this.h('span', calcSize(text))
    }
    this.patch(this.p, el)
    this.p = el
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

class ProgressTools extends UiComponents {
  constructor (theme) {
    super(theme)
    this.listeners = {}
    this.closeEl = this.createCloseIcon()
    this.pauseEl = this.createPauseIcon()
    this.startEl = this.createStartIcon()
    this.md5El = this.createMd5Icon()
    this.el = this.h(`div.${this.theme}-progress-tools`, [this.closeEl, this.md5El])
  }
  createCloseIcon () {
    let icon = new Icon(this.theme, 'delete', 20, 20, `${this.theme}-icon-close`)
    return this.h(`span.${this.theme}-tool-close.${this.theme}-tool`, {
      on: {
        click: this.deleteUpload.bind(this)
      }
    }, [ icon.getEl() ])
  }
  createPauseIcon () {
    let icon = new Icon(this.theme, 'pause', 20, 20, `${this.theme}-icon-pause`)
    return this.h(`span.${this.theme}-tool-pause.${this.theme}-tool`, {
      on: {
        click: this.pauseUpload.bind(this)
      }
    }, [ icon.getEl() ])
  }
  createStartIcon () {
    let icon = new Icon(this.theme, 'contine', 20, 20, `${this.theme}-icon-pause`)
    return this.h(`span.${this.theme}-tool-pause.${this.theme}-tool`, {
      on: {
        click: this.startUpload.bind(this)
      }
    }, [icon.getEl()])
  }
  createMd5Icon () {
    let icon = new Icon(this.theme, 'waiting', 20, 20, `${this.theme}-icon-waiting`, `${this.theme}-animate-rotate`)
    return this.h(`span.${this.theme}-tool-waiting.${this.theme}-tool`, [icon.getEl()])
  }
  // 暂停上传
  pauseUpload () {
    let newEl = this.h(`div.${this.theme}-progress-tools`, [this.closeEl, this.startEl])
    this.patch(this.el, newEl)
    this.el = newEl
    this.trigger('pause')
  }
  // 开始上传
  startUpload () {
    let newEl = this.h(`div.${this.theme}-progress-tools`, [this.closeEl, this.pauseEl])
    this.patch(this.el, newEl)
    this.el = newEl
  }
  /**
   * 删除上传
   */
  deleteUpload () {
    this.trigger('delete')
  }
  /**
   * 上传成功,
   * 隐藏暂停按钮，
   * 显示成功按钮
   */
  uploadSuccess () {
    if (!this.successEl) {
      let icon = new Icon(this.theme, 'success', 20, 20, `${this.theme}-icon-success`)
      this.successEl = this.h(`span.${this.theme}-tool-success.${this.theme}-tool`, [icon.getEl()])
    }
    let newEl = this.h(`div.${this.theme}-progress-tools`, [this.closeEl, this.successEl])
    this.patch(this.el, newEl)
    this.el = newEl
  }
  /**
   * 上传失败
   */
  // todo: 上传失败
  uploadFailed () {}
  /**
   * 根据不同的上传状态，显示不同的ICON
   * @param {string} statu 上传状态
   */
  setStatus (statu) {
    // 上传成功
    if (statu === 'success') {
      this.uploadSuccess()
    }
    // else if (statu === 'md5') { // MD5计算
    //   this.md5Calculating()
    // }
    else {
      this.uploadFailed()
    }
  }
}
