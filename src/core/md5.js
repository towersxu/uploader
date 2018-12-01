import { getFileMd5 } from '../utils/fileUtil'

// todo: 序列
export default function (file) {
  return new Promise((resolve) => {
    getFileMd5(file, (res) => {
      resolve(res)
    })
  })
}
