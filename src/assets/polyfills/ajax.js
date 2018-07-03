export default {
  post (url, params) {
    let xhr = _createXhr()
    xhr.open('POST', url)
    xhr.onprogress = params.progress
    xhr.onload = params.load
    if (xhr.upload && params.progress) {
      xhr.upload.onprogress = throttle(function (data) {
        if (xhr.readyState === 1) {
          let progress = Math.ceil(data.loaded / data.total * 100) + '%'
          params.progress(progress, data.loaded)
        }
      }, 200)
      xhr.upload.onloadstart = params.loadStart
      xhr.upload.onloadEnd = params.loadEnd
      xhr.upload.onerror = params.error
      xhr.upload.onabort = params.abort
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          let res
          try {
            res = JSON.parse(xhr.responseText)
          }
          catch (e) {
            res = xhr.responseText
          }
          // todo: 这里可能有不返回100%情况。
          params.progress('100%') // 因为在进度里面做了throttle，并且延迟了200ms，所以可能出现无法返回正确进度。
          params.success(res)
        }
        else {
          params.error(xhr)
        }
      }
    }
    xhr.send(params.data)

    return xhr
  }
}

function _createXhr () {
  return new XMLHttpRequest()
}

function throttle (fn, delay) {
  var id, args

  return function _throttle () {
    args = arguments

    if (!id) {
      fn.apply(window, args)
      id = setTimeout(function () {
        id = 0
        fn.apply(window, args)
      }, delay)
    }
  }
}
