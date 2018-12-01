import ajax from '../assets/polyfills/ajax'
import config from '../config'

export default function (md5, size, name) {
  return new Promise((resolve) => {
    ajax.post({
      url: config.getBackendServerPath(),
      data: {
        hasMd5: true,
        md5: md5,
        fileFormat: 'png',
        size: size,
        fileName: name
      }
    }).then((res) => {
      resolve(res)
    }).catch(e => {
      // todo: 格式化错误对象e的输出
      Event.trigger('HEADER:ERROR_TEXT', e.message)
    })
  })
}
