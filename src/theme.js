import './assets/less/theme.less'

import { init, h } from 'snabbdom'
import classMod from 'snabbdom/modules/class'
import stylMod from 'snabbdom/modules/style'
import props from 'snabbdom/modules/props'
import attributes from 'snabbdom/modules/attributes'

import eventlisteners from 'snabbdom/modules/eventlisteners'
import { toVNode } from 'snabbdom/tovnode'
import I18n from './assets/i18n/index'

let patch = init([classMod, stylMod, props, attributes, eventlisteners])

// NOTE: 先把所有的DOM操作放入这里处理，便于以后统一切换为其它处理。
// warning: 如果每个小地方的修改都要调用一次patch, 这样似乎并不能更快，是否还是要引入周期的概念，让所有的修改在一个周期里面完成。
// warning: 查看源码，似乎有现成的序列处理。
export default class Theme {
  constructor (theme) {
    this.theme = theme
  }
  appendElTo () {}
  patch (oldVnode, newVnode) {
    patch(oldVnode, newVnode)
  }
  h (...arg) {
    return h(...arg)
  }
  toVNode (...arg) {
    return toVNode(...arg)
  }
  i18n (key) {
    return I18n(key)
  }
}

