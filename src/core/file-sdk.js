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
import ajax from '../assets/polyfills/ajax'
import config from '../config'
import Events from '../events'
import getFileMd5 from './md5'

export default class FileSdk extends Events {
  constructor (file) {
    super()
    this.file = file
  }
  start () {
    this.getFileMd5()
  }
  getFileMd5 () {
    this.trigger('md5')
    getFileMd5(this.file, (md5) => {
      this.trigger('auth')
      ajax.post({
        url: config.getBackendServerPath(),
        data: {
          hasMd5: true,
          md5: md5,
          fileFormat: 'png',
          size: this.file.size,
          fileName: this.file.name
        }
      })
      .then((res) => {
        this.upload()
      })
      .catch(e => {
        console.log(e)
      })
    })
  }
  upload () {
    let uploader = ajaxUploader(this.file)
    uploader.on('progress', (data, loaded) => {
      this.trigger('progress', data, loaded)
    })
    uploader.on('success', (data) => {
      this.trigger('success', data)
    })
  }
}
