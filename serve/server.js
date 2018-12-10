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
  formData.userId = '17194b0d26494756b853a1eaf4b3e1e1'
  formData.moduleKey = 'test_key'
  formData.bussinessId = 'dd9d916551c511e8930c000c29c57b21'
  request.post({
    url: 'http://10.4.86.4:4001/upload/checkFileMd5',
    formData: JSON.stringify(formData)
  }, function (err, response, body) {
    if (err) {
      res.json({
        e: err,
        code: -1,
        message: '无法连接到文件服务器'
      })
      return
    }
    try {
      res.json(JSON.parse(body))
    } catch (e) {
      res.send(body)
    }
  })
})
app.use(express.static(path.resolve(__dirname, 'static')))
app.listen(4001, function () {
  console.log('serve listen on port 4001')
})
