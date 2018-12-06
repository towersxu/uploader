// import './assets/less/common.less'

import LOG from './logger.js'
import WebUi from './ui/webui'
import { setConfig } from './config'

const UI_TYPES = [
  'webui', // 带样式的web端文件上传
  'mobileui', // 带样式的mobile端文件上传
  'websdk', // 无样式的web端文件上传
  'mobilesdk' // 无样式的mobile端文件上传
]

export class Uploader {
  /**
   * 上传的构造函数
   * @param { string } path - 后端上传配置路径
   * @param { string } uploadPath - 文件服务器上传路径
   * @param { HTMLElement } btnEl - 上传元素
   * @param { HTMLElement } fileListEl - 显示上传进度的列表
   * @param { string } env - 上传插件的运行环境
   * @param { string } theme - 上传的主题标签
   * @param { object } options - 上传设置配置
   */
  constructor (option) {
    let config = setConfig(option)
    if (this.validate(config.env, config.btnEl, config.fileListEl)) {
      this.env = config.env
      this.btnEl = config.btnEl
      this.fileListEl = config.fileListEl
      this.path = config.path
      this.options = config.options
      this.theme = config.theme
      this.handleUploader()
    }
  }
  handleUploader () {
    if (this.env === 'webui') {
      this.uploader = new WebUi(this.btnEl, this.fileListEl, this.theme)
    }
  }
  start () {
    console.log('start')
  }
  /**
   * 检验传入参数是否合法
   * @param {string} env 运行环境
   * @param  {...any} arg 参数
   */
  validate (env, ...arg) {
    if (UI_TYPES.indexOf(env) === -1) {
      LOG.error('FE1003')
      return
    }
    if (env === 'webui') {
      let btnEl = arg[0]
      let fileListEl = arg[1]
      if (!(btnEl instanceof HTMLElement)) {
        LOG.error('FE1001')
        return
      }
      if (!(fileListEl instanceof HTMLElement)) {
        LOG.error('FE1002')
        return
      }
    }
    return true
  }
}
