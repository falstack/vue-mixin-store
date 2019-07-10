export const defaultListObj = {
  result: [],
  page: 0,
  noMore: false,
  nothing: false,
  loading: false,
  error: null,
  fetched: false,
  total: 0,
  extra: null
}

export const generateFieldName = (func, type, query = {}) => {
  let result = `${func}-${type}`
  Object.keys(query)
    .filter(
      _ =>
        !~['undefined', 'object', 'function'].indexOf(typeof query[_]) &&
        !~['page', 'changing', 'is_up', '__refresh__'].indexOf(_)
    )
    .sort()
    .forEach(key => {
      result += `-${key}-${query[key]}`
    })
  return result
}

export const parseDataUniqueId = (data, changing) => {
  if (!/\./.test(changing)) {
    return data[changing]
  }
  let result = data
  changing.split('.').forEach(key => {
    result = result[key]
  })
  return result
}

export const getDateFromCache = (fieldName, curTime) => {
  try {
    const expiredAt = localStorage.getItem(
      `vue-mixin-store-${fieldName}-expired-at`
    )
    if (!expiredAt || curTime - expiredAt > 0) {
      localStorage.removeItem(`vue-mixin-store-${fieldName}`)
      localStorage.removeItem(`vue-mixin-store-${fieldName}-expired-at`)
      return null
    }
    const cacheStr = localStorage.getItem(`vue-mixin-store-${fieldName}`)
    if (!cacheStr) {
      return null
    }
    return JSON.parse(cacheStr)
  } catch (e) {
    return false
  }
}

export const setDataToCache = (fieldName, dataObj, expiredAt) => {
  try {
    localStorage.setItem(
      `vue-mixin-store-${fieldName}`,
      JSON.stringify(dataObj)
    )
    localStorage.setItem(`vue-mixin-store-${fieldName}-expired-at`, expiredAt)
  } catch (e) {
    // do nothing
  }
}

export const isArray = data =>
  Object.prototype.toString.call(data) === '[object Array]'
