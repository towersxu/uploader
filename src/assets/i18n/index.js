import I18n from './cn'

export default function (key, replacements) {
  let value = I18n[key]
  if (replacements && typeof replacements === 'object') {
    Object.keys(replacements).forEach((k) => {
      value = value.replace(k, replacements[k])
    })
  }
  return value
}
