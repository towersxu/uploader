/**
 * 组件配置
 */
import logger from './logger'

let config = {
  _upload_server_path: '', // 上传服务器地址
  _backend_server_path: '', // 后端服务器地址
  _suffix_list: [] // 上传文件名单
}
export default {
  /**
   * 获取上传服务器地址
   */
  getUploaderServerPath () {
    return config._upload_server_path
  },
  /**
   * 获取后端服务器地址
   */
  getBackendServerPath () {
    if (!config._backend_server_path) {
      logger.error('CF1001')
    }
    return config._backend_server_path
  },
  /**
   * 设置上传服务器地址
   */
  setUploaderServerPath (path) {
    config._upload_server_path = path
  },
  /**
   * 设置后端服务器地址
   */
  setBackendServerPath (path) {
    config._backend_server_path = path
  }
}
