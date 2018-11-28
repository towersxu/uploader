import UiComponents from '../ui-components'
import Events from '../../events'
const STATUS_TEXT = ['UPLOAD_HEADER', 'UPLOADING', 'UPLOADED']

export default class Header extends UiComponents {
  constructor (theme, status = 0) {
    super()
    this.theme = theme
    this.setStatus(status)
    Events.on('error-info', (msg) => {
      console.log('components error', msg)
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
    this.el = this.h(`div.${this.theme}-fileset-header`, [
      this.headerText,
      this.errorInfo
    ])
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
    this.errorInfo = this.patch(this.errorInfo, this.getErrorVNode(text))
  }
  getErrorVNode (text) {
    return this.h(`span.${this.theme}-header-error`, text)
  }
}
