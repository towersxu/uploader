const express = require('express')
const path = require('path')
const app = express()
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  console.log(req.originalUrl)
  // intercept OPTIONS method
  if (req.method == 'OPTIONS' && req.originalUrl === '/upload') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.post('/preupload', function (req, res) {
  console.log(req.query)
  res.json({
    code: 0,
    data: [],
    msg: '成功',
    token: 'e389ee4ba27e11e7aa04000c29c57b21'
  })
})
app.use(express.static(path.resolve(__dirname, 'static')))
app.listen(4001, function () {
  console.log('serve listen on port 4001')
})
