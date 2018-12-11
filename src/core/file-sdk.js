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
  constructor (fileInfo) {
    super()
    this.fileInfo = fileInfo
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
    /**
     * 触发事件
     */
    this.trigger(config.UPLOAD_STATUS.AUTH)
    Events.trigger(config.UPLOAD_STATUS.PROGRESS, this.fileInfo)
    /**
     * 服务器认证
     */
    auth(md5, this.fileInfo.size, this.fileInfo.name, this.fileInfo.suffix)
      .then(this._section.bind(this))
      .catch(e => {
        // todo: 格式化错误对象e的输出
        Events.trigger('HEADER:ERROR_TEXT', e.message)
        this.trigger(config.UPLOAD_STATUS.FAILED)
        Events.trigger(config.UPLOAD_STATUS.AUTHERROR, this.fileInfo, e)
        Events.trigger(config.UPLOAD_STATUS.FAILED, this.fileInfo, e)
      })
  }
  /**
   * 获取文件的一部分
   * @param {object} res 认证返回的对象
   */
  _section (res) {
    console.log(res)
    let ticket = res.token
    if (!res || !res.token) {
      this.trigger(config.UPLOAD_STATUS.FAILED)
      Events.trigger(config.UPLOAD_STATUS.ERROR, this.fileInfo, 'ticket required')
      return
    }
    // todo: 处理当前应该上传那一片
    section(this.fileInfo._file, this.fileInfo.start, this.fileInfo.chunkSize)
      .then((blob) => {
        this._uploadChunk(blob, ticket)
      })
  }
  _uploadChunk (blob, ticket) {
    // 上传分片~
    this._setFileInfoStatu(config.UPLOAD_STATUS.PROGRESS)
    this.fileInfo.file = blob
    this.fileInfo.token = ticket
    let uploader = uploadChunk(this.fileInfo)
    uploader.on('progress', (progress, loaded) => {
      this.fileInfo._progress = this.fileInfo.chunkIndex * this.fileInfo.chunkSize + loaded
      this.trigger(
        config.UPLOAD_STATUS.PROGRESS,
        Math.ceil(this.fileInfo._progress / this.fileInfo.size * 100) + '%',
        this.fileInfo._progress
      )
      Events.trigger(config.UPLOAD_STATUS.PROGRESS, this.fileInfo)
    })
    uploader.on('success', (data) => {
      if (this.fileInfo.chunkIndex < this.fileInfo.chunkLength - 1) {
        this.fileInfo.start = (this.fileInfo.chunkIndex += 1) * this.fileInfo.chunkSize
        // 如果上传被暂时或者删除了，则不继续上传下一个分片
        if (this.fileInfo._statu === config.UPLOAD_STATUS.PROGRESS) {
          this._section(data)
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
        // 触发上传成功，用于给外部uploader对象监听，适用于自定义UI模式
        Events.trigger(config.UPLOAD_STATUS.SUCCESS, this.fileInfo)
      }
    })
    // 分片上传失败
    uploader.on('error', (data) => {
      this.trigger(config.UPLOAD_STATUS.FAILED, data)
    })
    uploader.start()
    this.uploader = this.uploader
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
