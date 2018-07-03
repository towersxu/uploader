/**
 * 使用ajax的方式上传文件
 * @author xutao
 * @example
 * let uploader = ajaxUploader(file)
 * uploader.status = 0
 * uploader.on('progress', function () {})
 * uploader.on('start', function () {})
 * uploader.on('error', function () {})
 */

import ajax from '../assets/polyfills/ajax'
import Events from '../events'

// 自定义一个上传队列
// NOTE: 上传队列是否会被堵死？
// 对于每一个正在上传的uploader，是否需要心跳来保证上传没有被堵死？
let UPLOADER_QUEUE_STATUS = 0
const UPLOADER_QUEUE = Object.freeze({
  push: function (uploader) {
    this.list.push(uploader)
    this.run()
  },
  pop: function () {
    UPLOADER_QUEUE_STATUS = 0
    this.list.shift()
    this.run()
  },
  list: [],
  run: function () {
    if (UPLOADER_QUEUE_STATUS === 1 || this.length() === 0) {
      return
    }
    UPLOADER_QUEUE_STATUS = 1
    let uploader = this.list[0]
    uploader.on('end', () => {
      this.pop()
    })
    uploader.start()
  },
  length: function () {
    return this.list.length
  }
})

/**
 * uploader
 * 调用上传功能
 */
class Uploader extends Events {
  constructor (file) {
    super()
    this.file = file
  }
  start () {
    let form = new FormData()
    form.append('Content-Type', 'application/octet-stream')
    form.append('attach', this.file)
    this.xhr = ajax.post('http://localhost:3000/upload', {
      data: form,
      progress: (progress, loaded) => {
        this.trigger('progress', progress, loaded)
      },
      load: (data) => {
        this.trigger('end')
      },
      success: (data) => {
        this.trigger('success', data)
      },
      error: (data) => {
        this.trigger('error', data)
      },
      abort: (data) => {
        console.log('abort')
      }
    })
  }
  abort () {
    this.xhr.abort()
    this.trigger('end')
  }
}

export default function (file) {
  let uploader = new Uploader(file)
  UPLOADER_QUEUE.push(uploader)
  return uploader
}
