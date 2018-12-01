/**
 * 配置组件
 */
import logger from './logger'

let CONFIG = {
   // 上传服务器地址
  _upload_server_path: '',
   // 后端服务器地址
  _backend_server_path: '',
   // 上传文件名单
  _suffix_list: [],
  _chunk_size: 5 * 1024 * 1024, // 通webupload一样，5M的默认分片大小,
}
export default {
  /**
   * 获取上传服务器地址
   */
  getUploaderServerPath () {
    return CONFIG._upload_server_path
  },
  /**
   * 获取后端服务器地址
   */
  getBackendServerPath () {
    if (!CONFIG._backend_server_path) {
      logger.error('CF1001')
    }
    return CONFIG._backend_server_path
  },
  /**
   * 设置上传服务器地址
   */
  setUploaderServerPath (path) {
    CONFIG._upload_server_path = path
  },
  /**
   * 设置后端服务器地址
   */
  setBackendServerPath (path) {
    CONFIG._backend_server_path = path
  },
  chunkSize: CONFIG._chunk_size,
  setChunkSize (size) {
    CONFIG._chunk_size = size
  }
}
