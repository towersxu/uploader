import Theme from '../theme'

export default class UiComponents extends Theme {
  constructor (theme) {
    super(theme)
  }
  getEl () {
    return this.el
  }
}
