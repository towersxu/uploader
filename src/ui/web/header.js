import UiComponents from '../ui-components'

const STATUS_TEXT = ['UPLOADING', 'UPLOADED']

export default class Header extends UiComponents {
  constructor (theme, status = 0) {
    super()
    this.theme = theme
    this.setStatus(status)
  }
  getTextByStatus (status) {
    return this.i18n(STATUS_TEXT[status])
  }
  /**
   * 设置上传的状态
   * 1表示正在上传
   * 0表示上传完成
   */
  setStatus (status) {
    let text = this.getTextByStatus(status)
    this.el = this.h(`div.${this.theme}-fileset-header`, [
      this.h(`span.${this.theme}-header-text`, text)
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
}
