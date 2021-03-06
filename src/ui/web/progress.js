import UiComponents from '../ui-components'
import Icon from '../icon'
import config from '../../config'
/**
 * 进度条
 */
export default class Progress extends UiComponents {
  constructor (theme, name, suffix, size, key) {
    super(theme)
    this.progressbar = new ProgressBar(theme, name, suffix, size)
    this.progressbg = new ProgressBg(theme)
    let children = []
    children.push(this.progressbar.getEl())
    children.push(this.progressbg.getEl())
    this.el = this.h(`div.${this.theme}-progress`, {
      key: key
    }, children)
    // init listener
    this.progressbar.on('delete', () => {
      this.trigger('delete')
    })

  }
  /**
   * 设置上传的进度
   * @param {string} p 百分比
   * @param {number} loaded 数字，已上传的大小
   */
  setProgress (p, loaded) {
    // 设置背景
    this.progressbg.setProgress(p)
    // 设置文字
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
    this.handlePTools()
  }
  // 处理删除
  handlePTools () {
    this.ptools.on('pause', () => {
      console.log('pause')
    })
    this.ptools.on('delete', () => {
      this.trigger('delete')
    })
  }
  setStatus (statu, data) {
    if (statu === config.UPLOAD_STATUS.AUTH) {
      this.size.setStatus(1, '认证中')
    }
    if (statu === config.UPLOAD_STATUS.WAITING) {
      this.size.setStatus(1, '待上传')
    }
    if (statu === config.UPLOAD_STATUS.FAILED) {
      this.size.setStatus(3, '失败')
    }
    this.ptools.setStatus(statu, data)
  }
  /**
   * 设置已上传的大小
   * @param {string} p 进度，
   * @param {number} loaded 已上传内容的大小
   */
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
  /**
   * 设置上传的进度-文字
   * @param {number} size 已经上传的进度
   */
  setProgress (size) {
    if (typeof size === 'number') {
      size = calcSize(size)
    }
    let el = this.h('span', size)
    this.patch(this.p, el)
    this.p = el
  }
  /**
   * 
   * @param {number} type 进度文字提示类型，1表示默认文字题型，2表示默认上传进度提醒, 3表示上传错误。
   * @param {string} text 提醒文字或者已上传的数量
   */
  setStatus (type, text) {
    let el
    if (type === 1) {
      el = this.h(`span.${this.theme}-status-tips.${this.theme}-status-auth`, text)
    } else if (type === 2) {
      el = this.h('span', calcSize(text))
    } else if (type === 3) {
      el = this.h(`span.${this.theme}-status-tips.${this.theme}-status-error`, text)
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
    this.waitingEl = this.createIcon('waiting')
    this.el = this.h(`div.${this.theme}-progress-tools`, [this.closeEl, this.waitingEl])
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
    let icon = new Icon(this.theme, 'loading', 20, 20, `${this.theme}-icon-loading`, `${this.theme}-animate-rotate`)
    return this.h(`span.${this.theme}-tool-loading.${this.theme}-tool`, [icon.getEl()])
  }
  createIcon (type) {
    let icon = new Icon(this.theme, type, 20, 20, `${this.theme}-icon-${type}`)
    return this.h(`span.${this.theme}-tool-${type}.${this.theme}-tool`, [icon.getEl()])
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
   * 
   * @param {array} els 修改的els
   */
  changeIconEls (els) {
    let newEl = this.h(`div.${this.theme}-progress-tools`, els)
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
    else if (statu === config.UPLOAD_STATUS.AUTH) {
      // this.md5Calculating()
      this.changeIconEls([this.closeEl, this.md5El])
    }
    else {
      this.uploadFailed()
    }
  }
}
