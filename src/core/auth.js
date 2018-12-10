import ajax from '../assets/polyfills/ajax'
import config from '../config'

export default function (md5, size, name, suffix) {
  return new Promise((resolve, reject) => {
    ajax.post({
      url: config.path,
      data: {
        hasMd5: true,
        md5: md5,
        fileFormat: suffix,
        size: size,
        fileName: name
      }
    }).then((res) => {
      resolve(res)
    }).catch(e => {
      reject(e)
    })
  })
}
