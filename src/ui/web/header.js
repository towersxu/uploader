import UiComponents from '../ui-components'
import Events from '../../events'
import Icon from '../icon'
import config from '../../config'
const STATUS_TEXT = ['UPLOAD_HEADER', 'UPLOADING', 'UPLOADED']

export default class Header extends UiComponents {
  constructor (theme, status = 0) {
    super()
    this.theme = theme
    this.setStatus(status)
    Events.on('HEADER:ERROR_TEXT', (msg) => {
      this.showError(msg)
    })
  }
  getTextByStatus (status) {
    return this.i18n(STATUS_TEXT[status])
  }
  /**
   * 设置上传的状态
   * 2表示上传完成
   * 1表示正在上传
   * 0表示未上传
   */
  setStatus (status) {
    let text = this.getTextByStatus(status)
    this.headerText = this.h(`span.${this.theme}-header-text`, text)
    this.errorInfo = this.h(`span.${this.theme}-header-error`, '')
    let miniEl = new Icon(this.theme, 'mini', 16, 16, `${this.theme}-icon-mini`)
    let unminiEl = new Icon(this.theme, 'chuangkou', 16, 16, `${this.theme}-icon-chuangkou`)
    let closeEl = new Icon(this.theme, 'close', 16, 16, `${this.theme}-icon-hclose`)
    this.miniElSpan = this.h(`span`, {
      on: {
        click: this.minified.bind(this)
      }
    }, [miniEl.getEl()])
    this.unminiElSpan = this.h(`span`, {
      on: {
        click: this.unminified.bind(this)
      }
    }, [unminiEl.getEl()])    
    this.closeElSpan = this.h(`span`, {
      on: {
        click: this.close.bind(this)
      }
    }, [closeEl.getEl()])
    let tools = []
    if (config.minified) {
      tools = [
        this.unminiElSpan,
        this.closeElSpan
      ]
    } else {
      tools = [
        this.miniElSpan,
        this.closeElSpan
      ]
    }
    this.tools = this.h(`span.${this.theme}-header-tools`, tools)
    this.el = this.h(`div.${this.theme}-fileset-header`, [
      this.headerText,
      this.errorInfo,
      this.tools
    ])
  }
  minified () {
    // this.trigger('minify', true)
    Events.trigger('WEBUI:MINIFY_FILESET', true)
    this.unminifiedHeaderIcon()
  }
  /**
   * 修改header图片为unminEl图标
   */
  unminifiedHeaderIcon () {
    let tools = this.h(`span.${this.theme}-header-tools`, [
      this.unminiElSpan,
      this.closeElSpan
    ])
    this.tools = this.patch(this.tools, tools)
  }
  unminified () {
    // this.trigger('minify', false)
    Events.trigger('WEBUI:MINIFY_FILESET', false)
    this.minifiedHeaderIcon()
  }
  /**
   * 修改head图标为miniEl图标
   */
  minifiedHeaderIcon () {
    let tools = this.h(`span.${this.theme}-header-tools`, [
      this.miniElSpan,
      this.closeElSpan
    ])
    this.tools = this.patch(this.tools, tools)
  }
  close () {
    // this.trigger('close', true)
    Events.trigger('WEBUI:CLOSE_FILESET', true)
  }
  changeStatus (status) {
    let text = this.getTextByStatus(status)
    if (this.el) {
      let newEl = this.h(`div.${this.theme}-fileset-header`, [
        this.h(`span.${this.theme}-header-text`, text)
      ])
      this.patch(this.el, newEl)
    }
  }
  showError(text) {
    // todo: 采用序列显示错误提示
    this.errorInfo = this.patch(this.errorInfo, this.getErrorVNode(text))
    setTimeout(() => {
      this.showError('')
    }, 5000)
  }
  getErrorVNode (text) {
    return this.h(`span.${this.theme}-header-error`, {
      props: {
        title: text
      }
    }, text)
  }
}
