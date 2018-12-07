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
    debugger
    // todo: IE9 无法获取file
    if (!config.customUI && !config.showUI) {
      Events.trigger('WEBUI:SHOW_FILESET')
    }
    this.files = this.files.concat(new FileCore(e.target.files))
    this.handleFiles()
    // 重置选择内容，解决无法两次选择同一个文件的问题
    if (this.inputEl && this.inputEl.elm) {
      this.inputEl.elm.value = ''
    }
  }
  handleFiles () {
    let allProgress = []
    this.files.forEach((file, idx) => {
      if (file.show) {
        if (file._statu === config.UPLOAD_STATUS.INIT) {
          FileCore.uploadFile(file)
        }
        let progress = new Progress(this.theme, file.name, file.suffix, file.size, idx)
        allProgress.push(progress.getEl())
      }
    })
    // warning: 感觉这种写法好傻，创建一个新对象，比较新对象与之前的对象。在DOM渲染后在将旧对象引用指向新对象，然后回收旧对象。
    // warning: 如果双向绑定一定是这样做，注意不要一次修改整个对象树，而是只修改某个子树。
    let newList = this.h(`div.${this.theme}-fileset-list`, allProgress)
    this.patch(this.list, newList)
    this.list = newList
  }
}
