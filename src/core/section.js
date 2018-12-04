/**
 * 获取文件的一段内容
 * @param {blob} blob 需要获取切片的二进制对象,可以是file对象
 * @param {integer} start 开始切片的位置
 * @param {integer} length 需要切片的大小, 单位b
 */
// todo: 队列处理
export default function (blob, start, length) {
  return new Promise((resove) => {
    var nb = blob.slice(start, start + length)
    resove(nb)
  })
}