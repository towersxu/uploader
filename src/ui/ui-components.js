/**
 * @file 所有的UI组件统一继承的基类。
 */
import mixin from 'lodash-decorators/mixin'
import Events from '../events'
import Render from '../render'

/**
 * 进度工具
 * todo: mixin的用法很别扭。
 * 是用mixin一个对象，
 */
@mixin(Events.prototype)
export default class UiComponents extends Render {
  constructor (theme) {
    super(theme)
    this.listeners = {}
  }
  getEl () {
    return this.el
  }
}
