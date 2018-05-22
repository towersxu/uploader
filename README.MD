# 通用上传控件

## 使用说明

### script引入方式

```html
<script src="/static/uploader.js"></script>
<div id="uploader-button"></div>
<div id="filelist"></div>
```

```javascript
var UPLOADER_PATH = 'http://localhost:8080/upload'
var uploader = new Uploader({
  path: UPLOADER_PATH,
  btnEl: document.getElementById('uploader-button'),
  filesEl: document.getElementById('filelist'),
  env: 'web', // 'web' > 'mobile'
  theme: 'default',
  options: {
    auto: false,
    md5: true,
    type: 'ws', // 'ws'>'http'>'flash'. default: 'ws'
    queued: '2',
    ticket: 'bearer bxxx'
  }
})

uploader.on('progress', (file, index) => {})

uploader.start()
```
