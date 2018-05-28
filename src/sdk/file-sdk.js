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

export default class FileSdk extends Events {
  constructor (file) {
    super()
    this.file = file
  }
  start () {
    let uploader = ajaxUploader(this.file)
    uploader.on('progress', (data) => {
      this.trigger('progress', data)
    })
  }
}
