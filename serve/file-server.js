const express = require('express')
const path = require('path')
const app = express()
const formidable = require('formidable')
const fs = require('fs')
const only = require('only');
const uuid = require('./uuid')
const bodyParser = require('body-parser')
const multer = require('multer')
const concat = require('concat-files')
const AES = require('crypto-js/aes')

app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  // intercept OPTIONS method
  if (req.method == 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.post('/upload/checkFileMd5', function (req, res) {
  // let data = only(req.body, 'md5 hasMd5 userId moduleKey size bussinessId fileName fileFormat')
  let token
  // console.log(token)
  let configFile = path.resolve(__dirname, './uploads/' + req.body.md5 + '/config.json')
  if (fs.existsSync(configFile)) {
    let config = JSON.parse(fs.readFileSync(configFile))
    token = AES.encrypt(req.body.md5, config.chunkQueues.length.toString()).toString()
    if (config.chunkQueues && config.chunkQueues.length === config.chunkSize) {
      res.json({
        code: 100,
        data: config.chunkQueues,
        token: token
      })
    } else {
      res.json({
        code: 102,
        data: config.chunkQueues,
        token: token
      })
    }
  } else {
    token = AES.encrypt(req.body.md5, '0').toString()
    res.json({
      code: 0,
      data: [],
      token: token
    })
  }
})
// 处理文件上传
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // todo: ticket校验
    let dir = path.resolve(__dirname, './uploads/' + req.body.md5 + '/')
    if (fs.existsSync(dir)) {
      cb(null, dir)
    } else {
      fs.mkdir(dir, { recursive: true }, (err) => {
        cb(null, dir)
      })
    }
  },
  filename: function (req, file, cb) {
    cb(null, req.body.chunk + '.part')
  }
})

let upload = multer({ storage: storage })

app.post('/upload/fileUpload', upload.single('file'), function (req, res) {
  // res.status(403).json({
  //   code: -1,
  //   message: '上传凭证错误'
  // })
  let tempFile = path.resolve(__dirname, './uploads/' + req.body.md5 + '/' + req.body.chunk + '.part')
  let configFile = path.resolve(__dirname, './uploads/' + req.body.md5 + '/config.json')
  if (fs.existsSync(tempFile)) {
    // 文件写入成功，则读取文件配置信息
    var conf = {
      chunkQueues: [],
      chunkSize: 0,
      chunks: 0
    }
    if (fs.existsSync(configFile)) {
      conf = JSON.parse(fs.readFileSync(configFile))
    }
    // todo: 各种校验
    let chunk = Number(req.body.chunk)
    let token = AES.encrypt(req.body.md5, conf.chunkQueues.length.toString()).toString()
    if (conf.chunkQueues.indexOf(chunk) === -1) {
      conf.chunkQueues.push(chunk)
      conf.chunks = Number(req.body.chunks)
      conf.chunkSize = req.body.chunkSize
      conf.size = req.body.size
      conf.name = req.body.name
      fs.writeFile(configFile, JSON.stringify(conf), 'utf8', function () {
        // 如果所有的part文件已经完成上传了,合并part文件
        if (conf.chunkQueues.length === conf.chunks) {
          concat(conf.chunkQueues.map((c) => {
            return path.resolve(__dirname, './uploads/' + req.body.md5 + '/' + c + '.part')
          }), path.resolve(__dirname, './uploads/' + req.body.md5 + '/' + req.body.name), function (err) {
            res.json({
              code: 0,
              filePath: '/uploads/' + req.body.md5 + '/' + req.body.name,
              data: conf
            })
          })
        } else {
          res.json({
            code: 0,
            data: conf,
            token: token
          })
        }
      })
    } else {
      res.json({
        code: 0,
        data: conf,
        token: token
      })
    }
  } else {
    res.json({
      code: -1,
      data: []
    })
  }
})

app.post('/upload', function (req, res) {
  let filename = ''
  let suffix = ''
  // create an incoming form object
  var form = new formidable.IncomingForm()
  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads')

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function (field, file) {
    filename = file.name
    let suffixs = filename.split('.')
    if (suffixs.length > 1) {
      suffix = suffixs.pop()
      filename = (new Date()).getTime() + '.' + suffix
    }
    fs.rename(file.path, path.join(form.uploadDir, filename))
  })

  // log any errors that occur
  form.on('error', function (err) {
    console.log('An error has occured: \n' + err)
  })

  // once all the files have been uploaded, send a response to the client
  form.on('end', function () {
    let obj = {
      name: filename,
      state: 'SUCCESS',
      type: suffix,
      url: '/uploads/' + filename
    }
    res.send(JSON.stringify(obj))
  })

  // parse the incoming request containing the form data
  form.parse(req)
})

app.listen(4000, function () {
  console.log('serve listen on port 4000')
})
