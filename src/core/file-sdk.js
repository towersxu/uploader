/**
 * @file file-sdk
 * 通过传入file对象对文件进行处理，然后进行上传。
 * 1）计算文件的MD5 - md5.js(队列处理)
 * 2）认证是否有上传资格 - auth.js
 * 3）将文件进行分片 - section.js(队列处理)
 * 4）上传文件 - trans.js(队列处理)
 */
// import ajax from '../assets/polyfills/ajax'
import ajaxUploader from '../uploader/ajaxUploader'
import Events from '../events'
import getFileMd5 from './md5'
import auth from './auth'
import section from './section'

export default class FileSdk extends Events {
  constructor (file) {
    super()
    this.file = file
    this.statu = 'init'
  }
  start () {
    this.statu = 'md5'
    this._getFileMd5()
  }
  /**
   * 获取文件M5
   */
  _getFileMd5 () {
    this.trigger(this.statu)
    getFileMd5(this.file)
      .then(this._auth.bind(this))
  }
  /**
   * 获取用户认证
   * @param {string} md5 
   */
  _auth (md5) {
    this.statu = 'auth'
    this.trigger(this.statu)
    auth(md5, this.file.size, this.file.name)
      .then(this._section.bind(this))
  }
  /**
   * 获取文件的一部分
   * @param {object} res 认证返回的对象
   */
  _section (res) {
    section(this.file, 0, 1000)
      .then((blob) => {
        console.log(blob)
      })
  }
  upload () {
    let uploader = ajaxUploader(this.file)
    uploader.on('progress', (data, loaded) => {
      this.statu = 'progress'
      this.trigger('progress', data, loaded)
    })
    uploader.on('success', (data) => {
      this.statu = 'success'
      this.trigger('success', data)
    })
    uploader.on('abort', (data) => {
      this.statu = 'abort'
      this.trigger('abort', data)
    })
    this.uploader = uploader
  }
  getUploader () {
    return this.uploader
  }
}
