const express = require('express')
const path = require('path')
const app = express()
const request = require('request')
const bodyParser = require('body-parser')
const only = require('only')

app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  // intercept OPTIONS method
  if (req.method == 'OPTIONS' && req.originalUrl === '/upload') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.post('/preupload', function (req, res) {
  let formData = only(req.body, 'fileFormat fileName hasMd5 md5 size')
  request.post({
    url: 'http://127.0.0.1:4000/upload/checkFileMd5',
    formData: JSON.stringify(formData)
  }, function (err, response, body) {
    if (err) {
      res.json({
        code: -1,
        message: '无法连接到文件服务器'
      })
      return
    }
    res.json(JSON.parse(body))
  })
})
app.use(express.static(path.resolve(__dirname, 'static')))
app.listen(4001, function () {
  console.log('serve listen on port 4001')
})
