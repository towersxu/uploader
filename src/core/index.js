import I18n from '../assets/i18n/index'
import toolsUtil from '../utils/toolsUtil'
import Events from '../events'
import FileSdk from './file-sdk'
import config from '../config'

export default class FileCore {
  constructor (files) {
    return this.validate(files)
  }
  /**
   * 校验文件列表，返回通过校验的文件
   * @param {files} files 文件列表
   */
  validate (files) {
    let fileObjects = []
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      let suffix = toolsUtil.getSuffix(file.name)
      let errorMsg = this._isErrorName(file.name, suffix)
      if (errorMsg) {
        Events.trigger('HEADER:ERROR_TEXT', errorMsg)
        Events.trigger(config.UPLOAD_STATUS.ERROR, file, errorMsg)
      } else {
        let fileInfo = {
          start: 0, // 上传文件当前序号
          chunkSize: config.chunkSize, // 分片传输
          size: file.size,
          name: file.name,
          chunkLength: Math.ceil(file.size / config.chunkSize),
          chunkIndex: 0,
          MD5: '',
          suffix: suffix,
          _file: file,
          file: '',
          _uploadSize: 0,
          show: true,
          _statu: config.UPLOAD_STATUS.INIT,
          _progress: 0,
        }
        fileObjects.push(fileInfo)
      }
    }
    return fileObjects
  }
  /**
   * 通过文件名判断文件类型是否通过校验
   * @param {string} name 文件名
   */
  _isErrorName (name, suffix) {
    if (!suffix) {
      return `"${name}"${I18n('FV1001')}`
    } else if (config.whiteSuffixList.length > 0 && config.whiteSuffixList.indexOf(suffix) === -1) {
      return I18n('FV1002', {
        '${errorsuffix}': suffix
      })
    }
  }
}

FileCore.uploadFile = function (f) {
  let fs = new FileSdk(f)
  // fs.on('progress', (data, loaded) => {
  //   if (!loaded) {
  //     loaded = f.size
  //   }

  //   // progress.setProgress(data, loaded)
  // })
  // fs.on('success', (data) => {
  //   // progress.setStatus('success', data)
  // })
  // fs.on('md5', () => {
  //   // progress.setStatus('md5')
  // })
  // fs.on('auth', () => {
  //   // progress.setStatus('auth')
  // })
  // fs.on('waiting', () => {
  //   // progress.setStatus('waiting')
  // })
  fs.start()
  return fs
}
