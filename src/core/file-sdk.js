/**
 * @file file-sdk
 * 通过传入file对象对文件进行处理，然后进行上传。
 * 1）计算文件的MD5 - md5.js(队列处理)
 * 2）认证是否有上传资格 - auth.js
 * 3）将文件进行分片 - section.js(队列处理)
 * 4）上传文件 - trans.js(队列处理)
 */
// import ajax from '../assets/polyfills/ajax'
import { uploadChunk } from '../uploader/ajaxUploader'
import Events from '../events'
import getFileMd5 from './md5'
import auth from './auth'
import section from './section'
import config from '../config'

export default class FileSdk extends Events {
  constructor (file) {
    super()
    this.fileInfo = {
      start: 0, // 上传文件当前序号
      chunkSize: config.chunkSize, // 分片传输
      size: file.size,
      name: file.name,
      chunkLength: Math.floor(file.size / config.chunkSize),
      chunkIndex: 0,
      MD5: '',
      statu: config.UPLOAD_STATUS.INIT,
      file: file
    }
  }
  start () {
    this._getFileMd5()
  }
  /**
   * 获取文件M5
   */
  _getFileMd5 () {
    this.trigger(config.UPLOAD_STATUS.MD5)
    getFileMd5(this.fileInfo.file)
      .then(this._auth.bind(this))
  }
  /**
   * 获取用户认证
   * @param {string} md5 
   */
  _auth (md5) {
    this.fileInfo.MD5 = md5
    this.trigger(config.UPLOAD_STATUS.AUTH)
    auth(md5, this.fileInfo.size, this.fileInfo.name)
      .then(this._section.bind(this))
  }
  /**
   * 获取文件的一部分
   * @param {object} res 认证返回的对象
   */
  _section () {
    section(this.fileInfo.file, this.fileInfo.start, this.fileInfo.chunkSize)
      .then((blob) => {
        this._uploadChunk(blob)
      })
  }
  _uploadChunk (file) {
    // 上传分片~
    console.log("_uploadChunk_")
    this.trigger(config.UPLOAD_STATUS.UPLOADING)
    let uploader = uploadChunk(this.fileInfo)
    uploader.start()
    console.log('0000')
  }
  upload () {
    // let uploader = ajaxUploader(this.file)
    // uploader.on('progress', (data, loaded) => {
    //   this.statu = 'progress'
    //   this.trigger('progress', data, loaded)
    // })
    // uploader.on('success', (data) => {
    //   this.statu = 'success'
    //   this.trigger('success', data)
    // })
    // uploader.on('abort', (data) => {
    //   this.statu = 'abort'
    //   this.trigger('abort', data)
    // })
    // this.uploader = uploader
  }
  getUploader () {
    return this.uploader
  }
}
