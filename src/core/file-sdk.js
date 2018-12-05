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
      chunkLength: Math.ceil(file.size / config.chunkSize),
      chunkIndex: 0,
      MD5: '',
      _file: file,
      file: '',
      _uploadSize: 0,
      _statu: config.UPLOAD_STATUS.INIT,
      _progress: 0,
    }
  }
  /**
   * 开始上传
   */
  start () {
    this._getFileMd5()
  }
  /**
   * 暂停上传
   */
  pause () {
    this._setFileInfoStatu(config.UPLOAD_STATUS.PAUSE)
  }
  /**
   * 取消上传
   */
  cancel () {
    this._setFileInfoStatu(config.UPLOAD_STATUS.CANCEL)
  }
  /**
   * 设置文件上传状态
   * @param {string} statu 文件状态
   */
  _setFileInfoStatu (statu) {
    this.fileInfo._statu = statu
  }
  /**
   * 获取文件M5
   */
  _getFileMd5 () {
    this._setFileInfoStatu(config.UPLOAD_STATUS.MD5)
    this.trigger(config.UPLOAD_STATUS.MD5)
    getFileMd5(this.fileInfo._file)
      .then(this._auth.bind(this))
  }
  /**
   * 获取用户认证
   * @param {string} md5 
   */
  _auth (md5) {
    this.fileInfo.MD5 = md5
    this._setFileInfoStatu(config.UPLOAD_STATUS.AUTH)
    this.trigger(config.UPLOAD_STATUS.AUTH)
    auth(md5, this.fileInfo.size, this.fileInfo.name)
      .then(this._section.bind(this))
  }
  /**
   * 获取文件的一部分
   * @param {object} res 认证返回的对象
   */
  _section () {
    section(this.fileInfo._file, this.fileInfo.start, this.fileInfo.chunkSize)
      .then((blob) => {
        this._uploadChunk(blob)
      })
  }
  _uploadChunk (blob) {
    // 上传分片~
    this._setFileInfoStatu(config.UPLOAD_STATUS.PROGRESS)
    this.fileInfo.file = blob
    let uploader = uploadChunk(this.fileInfo)
    uploader.on('progress', (progress, loaded) => {
      this.fileInfo._progress = this.fileInfo.chunkIndex * this.fileInfo.chunkSize + loaded
      this.trigger(
        config.UPLOAD_STATUS.PROGRESS,
        Math.ceil(this.fileInfo._progress / this.fileInfo.size * 100) + '%',
        this.fileInfo._progress
      )
    })
    uploader.on('success', (data) => {
      if (this.fileInfo.chunkIndex < this.fileInfo.chunkLength - 1) {
        this.fileInfo.start = (this.fileInfo.chunkIndex += 1) * this.fileInfo.chunkSize
        // 如果上传被暂时或者删除了，则不继续上传下一个分片
        if (this.fileInfo._statu === config.UPLOAD_STATUS.PROGRESS) {
          this._section()
        }
      } else {
        // todo: 如果刚好在上传最后一个分片的过程中暂停
        // todo: 如果刚好在上传最后一个分片的过程中删除
        this._setFileInfoStatu(config.UPLOAD_STATUS.SUCCESS)
        this.trigger(
          config.UPLOAD_STATUS.PROGRESS,
          '100%',
          this.fileInfo.size
        )
        this.trigger(
          config.UPLOAD_STATUS.SUCCESS,
          data
        )
      }
    })
    uploader.start()
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
