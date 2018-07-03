import Render from '../render'
import FileSdk from '../sdk/file-sdk'
import Progress from './web/progress'
import Header from './web/header'

export default class WebUi extends Render {
  constructor (btnEl, fileListEl, theme) {
    super(theme)
    this.btnEl = btnEl
    this.files = []
    // this.fileListId = fileListEl.getAttribute('id')
    this.resetUploadBtn()
    this.progressEls = []
    this.fileListHeader = new Header(theme)
    this.progressEls.push(this.fileListHeader.getEl())
    this.fileListHeader.setStatus(0)
    this.list = this.h(`div.${this.theme}-progress-list`, [])
    this.progressEls.push(this.list)
    this.fileListVnode = this.h(`div.${this.theme}-fileset`, this.progressEls)
    this.patch(fileListEl, this.fileListVnode)
  }
  /**
   * 包裹上传元素，使其能进行上传
   */
  resetUploadBtn () {
    let nEl = this.h(`div.${this.theme}-filebutton-wrapper`, {
      style: {
        width: this.btnEl.offsetWidth + 'px',
        height: this.btnEl.offsetHeight + 'px'
      }
    }, [
      this.toVNode(this.btnEl),
      this.h('input', {
        props: {
          type: 'file',
          multiple: 'multiple'
        },
        on: {
          change: this.fileChange.bind(this)
        }
      })
    ])
    this.patch(this.btnEl, nEl)
  }
  // 根据上传的文件数，初始化文件上传对象
  fileChange (e) {
    // todo: IE9 无法获取file
    let files = []
    Array.prototype.map.call(e.target.files, (f) => {
      if (/\.([a-zA-Z]+?)$/.test(f.name)) { // 只能上传带有后缀的文件
        let fs = new FileSdk(f)
        let suffix = RegExp.$1
        let progress = new Progress(this.theme, f.name, suffix, f.size)
        fs.on('progress', (data, loaded) => {
          console.log(loaded)
          if (!loaded) {
            loaded = f.size
          }
          progress.setProgress(data, loaded)
        })
        fs.on('success', (data) => {
          progress.setStatus('success', data)
        })
        fs.on('md5', () => {
          progress.setStatus('md5')
        })
        fs.on('auth', () => {
          progress.setStatus('auth')
        })
        progress.on('pause', () => {
          // fs.pause()
        })
        progress.on('start', () => {
          // fs.start()
        })
        progress.on('delete', () => {
          // 1) 取消上传
          // 2) 上传上传进度条
          // 3) 同步修改上传文件对象列表
          // fs.cancel()
        })
        fs.start()
        files.push({
          f: fs,
          p: progress,
          name: f.name,
          size: f.size,
          suffix: suffix
        })
      }
    })
    this.files = this.files.concat(files)
    this.handleFiles()
  }
  handleFiles () {
    let allProgress = []
    this.files.map((file) => {
      allProgress.push(file.p.getEl())
    })
    // warning: 感觉这种写法好傻，创建一个新对象，比较新对象与之前的对象。在DOM渲染后在将旧对象引用指向新对象，然后回收旧对象。
    // warning: 如果双向绑定一定是这样做，注意不要一次修改整个对象树，而是只修改某个子树。
    let newList = this.h(`div.${this.theme}-fileset-list`, allProgress)
    this.patch(this.list, newList)
    this.list = newList
  }
}
