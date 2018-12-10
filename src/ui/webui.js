import Render from '../render'
import FileSdk from '../core/file-sdk'
import Progress from './web/progress'
import Header from './web/header'
import toolsUtil from '../utils/toolsUtil'
import FileCore from '../core/index'
import Events from '../events'
import config from '../config'

export default class WebUi extends Render {
  constructor (btnEl, fileListEl, theme) {
    super(theme)
    this.btnEl = btnEl
    this.files = []
    // this.fileListId = fileListEl.getAttribute('id')
    this.inputEl = this.h('input', {
      props: {
        type: 'file',
        multiple: 'multiple'
      },
      on: {
        change: this.fileChange.bind(this)
      }
    })
    this.resetUploadBtn()
    this.progressEls = []
    this.fileListHeader = new Header(theme)
    this.progressEls.push(this.fileListHeader.getEl())
    this.list = this.h(`div.${this.theme}-progress-list`, [])
    this.progressEls.push(this.list)
    this.fileListVnode = this.h(`div.${this.theme}-fileset`, {
      class: {
        hide: !config.showUI,
        minified: !!config.minified
      }
    }, this.progressEls)
    this.patch(fileListEl, this.fileListVnode)
    this.initListener()
  }
  initListener () {
    /**
     * @event WEBUI:MINIFY_FILESET
     * 监听最小化上传UI
     */
    Events.on('WEBUI:MINIFY_FILESET', (isMinify) => {
      let fileListVnode = this.h(`div.${this.theme}-fileset`, {
        class: {
          minified: isMinify
        }
      }, this.progressEls)
      this.fileListVnode = this.patch(this.fileListVnode, fileListVnode)
    })
    /**
     * @event WEBUI:CLOSE_FILESET
     * 监听关闭上传UI
     */
    Events.on('WEBUI:CLOSE_FILESET', () => {
      let fileListVnode = this.h(`div.${this.theme}-fileset`, {
        class: {
          hide: true
        }
      }, this.progressEls)
      this.fileListVnode = this.patch(this.fileListVnode, fileListVnode)
    })
    /**
     * @on WEBUI:SHOW_FILESET
     * 监听显示文件列表
     */
    Events.on('WEBUI:SHOW_FILESET', () => {
      let fileListVnode = this.h(`div.${this.theme}-fileset`, {
        class: {
          hide: false,
          show: true,
          minified: false
        }
      }, this.progressEls)
      this.fileListVnode = this.patch(this.fileListVnode, fileListVnode)
      this.fileListHeader.minifiedHeaderIcon()
    })
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
      this.inputEl
    ])
    this.patch(this.btnEl, nEl)
  }
  // 根据上传的文件数，初始化文件上传对象
  fileChange (e) {
    // todo: IE9 无法获取file
    if (!config.customUI && !config.showUI) {
      Events.trigger('WEBUI:SHOW_FILESET')
    }
    let files = new FileCore(e.target.files)
    files.forEach((file, idx) => {
      if (file.show) {
        let progress = new Progress(this.theme, file.name, file.suffix, file.size, idx)
        progress.idx = this.files.length + idx
        if (file._statu === config.UPLOAD_STATUS.INIT) {
          let fs = FileCore.uploadFile(file)
          this._exchangeBridge(fs, progress)
        }
        file._p = progress
      }
    })
    this.files = this.files.concat(files)
    this._handleFiles()
    // 重置选择内容，解决无法两次选择同一个文件的问题
    if (this.inputEl && this.inputEl.elm) {
      this.inputEl.elm.value = ''
    }
  }
  /**
   * 选择文件后，处理文件
   */
  _handleFiles () {
    let allProgress = []
    this.files.forEach((file, idx) => {
      if (file.show) {
        allProgress.push(file._p.getEl())
      }
    })
    // warning: 感觉这种写法好傻，创建一个新对象，比较新对象与之前的对象。在DOM渲染后在将旧对象引用指向新对象，然后回收旧对象。
    // warning: 如果双向绑定一定是这样做，注意不要一次修改整个对象树，而是只修改某个子树。
    let newList = this.h(`div.${this.theme}-fileset-list`, allProgress)
    this.patch(this.list, newList)
    this.list = newList
  }
  /**
   * js与UI控件通信
   * @param {object} fs 上传控件
   * @param {object} progress 文件上传进度条UI
   */
  _exchangeBridge (fs, progress) {
    fs.on('progress', (data, loaded) => {
      if (!loaded) loaded = file.size
      progress.setProgress(data, loaded)
    })
    fs.on('success', (data) => {
      progress.setStatus('success', data)
    })
    fs.on('md5', (data) => {
      progress.setStatus('md5')
    })
    fs.on('auth', () => {
      progress.setStatus('auth')
    })
    fs.on('waiting', () => {
      progress.setStatus('waiting')
    })
    fs.on(config.UPLOAD_STATUS.FAILED, () => {
      console.log('failed...')
      progress.setStatus(config.UPLOAD_STATUS.FAILED)
    })
    progress.on('delete', () => {
      // 1) 取消上传
      // 2) 上传上传进度条
      // 3) 同步修改上传文件对象列表
      fs.cancel()
      this.files[progress.idx].show = false
      this._handleFiles()
    })
  }
}
