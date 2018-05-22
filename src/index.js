import './assets/less/common.less'

import fetch from './assets/polyfills/fetch'
import LOG from './logger.js'
import WebUi from './uploader/webui'

const UI_TYPES = [
  'webui', // 带样式的web端文件上传
  'mobileui', // 带样式的mobile端文件上传
  'websdk', // 无样式的web端文件上传
  'mobilesdk' // 无样式的mobile端文件上传
]

export default class Uploader {
  /**
   * 上传的构造函数
   * @param { string } path - 上传路径
   * @param { HTMLElement } btnEl - 上传元素
   * @param { HTMLElement } fileListEl - 显示上传进度的列表
   * @param { string } env - 上传插件的运行环境
   * @param { string } theme - 上传的主题标签
   * @param { object } options - 上传设置配置
   */
  constructor ({ path, btnEl, fileListEl, env, theme, options }) {
    if (!(btnEl instanceof HTMLElement)) {
      LOG.error('FE1001')
    }
    if (!(fileListEl instanceof HTMLElement)) {
      LOG.error('FE1002')
    }
    this.env = UI_TYPES.indexOf(env) === -1 ? 'webui' : env
    this.btnEl = btnEl
    this.fileListEl = fileListEl
    this.path = path
    this.options = options
  }
  handleUploader () {
    if (this.env === 'webui') {
      this.uploader = new WebUi(this.btnEl, this.fileListEl)
    }
  }
  start () {
    console.log('start')
    fetch()
  }
}
