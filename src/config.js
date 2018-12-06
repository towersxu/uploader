/**
 * 配置组件
 */
// import logger from './logger'

let UPLOAD_STATUS = {
  INIT: 'init',
  MD5: 'md5',
  AUTH: 'auth',
  PROGRESS: 'progress', // 上传中
  SUCCESS: 'success', // 上传成功
  CANCEL: 'cancel', // 取消上传
  PAUSE: 'pause', // 暂停
  WAITING: 'waiting' // 待上传
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
  auto: false,
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
  UPLOAD_STATUS: UPLOAD_STATUS
}

export function setConfig (conf) {
  if (typeof conf === 'object') {
    CONFIG = Object.assign(CONFIG, conf)
  }
  return CONFIG
}

export default CONFIG

// export default {
//   /**
//    * 获取上传服务器地址
//    */
//   getUploaderServerPath () {
//     return CONFIG._upload_server_path
//   },
//   /**
//    * 获取后端服务器地址
//    */
//   getBackendServerPath () {
//     if (!CONFIG._backend_server_path) {
//       logger.error('CF1001')
//     }
//     return CONFIG._backend_server_path
//   },
//   /**
//    * 设置上传服务器地址
//    */
//   setUploaderServerPath (path) {
//     CONFIG._upload_server_path = path
//   },
//   /**
//    * 设置后端服务器地址
//    */
//   setBackendServerPath (path) {
//     CONFIG._backend_server_path = path
//   },
//   chunkSize: CONFIG._chunk_size,
//   setChunkSize (size) {
//     CONFIG._chunk_size = size
//   },
//   UPLOAD_STATUS: UPLOAD_STATUS
// }
