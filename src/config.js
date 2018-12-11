/**
 * 配置组件
 */
// import logger from './logger'

let UPLOAD_STATUS = {
  INIT: 'init',
  MD5: 'md5',
  AUTH: 'auth',
  ERROR: 'error', // 上传出现错误
  AUTHERROR: 'autherror', // 认证失败
  PROGRESS: 'progress', // 上传中
  SUCCESS: 'success', // 上传成功
  CANCEL: 'cancel', // 取消上传
  PAUSE: 'pause', // 暂停
  FAILED: 'failed', //上传失败
  ABORT: 'abort', // 终止上传
  WAITING: 'waiting' // 待上传
}

let FILE_CODE = {
  /**
   * 文件上传成功
   */
  SUCCESS: 0,
  /**
   * 文件已经上传，可以秒传
   */
  EXIST: 100,
  /**
   * 文件服务器上没有，需要重新上传
   */
  UN_EXIST: 101,
  /**
   * 文件已部分上传，可以断点续传
   */
  PART_EXIST: 102,
  /**
   * 业务相关
   * 无对应学校
   */
  ERROR_AUTH: 103,
  /**
   * 业务相关
   * 学校存储空间限制
   */
  FORBID_UPLOAD: 104
}


let CONFIG = {
   // 上传服务器地址
  uploadPath: '',
   // 后端服务器地址
  path: '',
  // 调用后端上传带上的headers
  headers: {},
  // 上传文件的按钮
  btnEl: '',
  // 放置上传UI的元素
  fileListEl: '',
  // 上传环境配置
  env: '',
  // 上传文件白名单
  whiteSuffixList: [],
  // 主题
  theme: 'default',
  // 可选，设置在input type="file"上的属性
  accepts: '',
  // 分片上传文件的大小
  chunkSize: 5 * 1024 * 1024, // 通webupload一样，5M的默认分片大小,
  // 自动上传
  auto: true,
  // md5快传
  md5: true,
  /**
   * 上传的类型，默认HTTP分片上传，
   */
  type: 'chunk',
  /**
   * 同时上传的数量
   */
  queued: 1,
  /**
   * 上传文件的大小限制，默认-1表示不限制
   */
  max: -1,
  /**
   * 上传文件的最小限制，默认-1表示不限制
   */
  min: -1,
    /**
   * 自定义UI，
   * 如果设置为true, 这上传控件不在提供UI，只提供回调
   */
  customUI: false,
  /**
   * 是否在一开始就显示上传UI控件
   */
  showUI: false,
  /**
   * 上传UI控件收起模式
   */
  minified: false,
  /**
   * 上传状态
   */
  UPLOAD_STATUS: UPLOAD_STATUS,
  /**
   * 文件在服务器的状态
   */
  FILE_CODE: FILE_CODE
}

export function setConfig (conf) {
  if (typeof conf === 'object') {
    CONFIG = Object.assign(CONFIG, conf)
  }
  return CONFIG
}

export default CONFIG

