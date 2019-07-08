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

export const cacheNotExpired = (fieldName, timeout) => {
  try {
    const cacheSetAt = localStorage.getItem(
      `vue-mixin-store-${fieldName}-timer`
    )
    if (!cacheSetAt) {
      return false
    }
    const result = Date.now() - cacheSetAt < timeout * 1000
    if (!result) {
      localStorage.removeItem(`vue-mixin-store-${fieldName}`)
      localStorage.removeItem(`vue-mixin-store-${fieldName}-timer`)
    }
    return result
  } catch (e) {
    return false
  }
}

export const readDataFromCache = fieldName => {
  try {
    const cacheStr = localStorage.getItem(`vue-mixin-store-${fieldName}`)
    if (!cacheStr) {
      return null
    }
    return JSON.parse(cacheStr)
  } catch (e) {
    return null
  }
}

export const setDataToCache = (fieldName, dataObj) => {
  try {
    localStorage.setItem(
      `vue-mixin-store-${fieldName}`,
      JSON.stringify(dataObj)
    )
    localStorage.setItem(`vue-mixin-store-${fieldName}-timer`, Date.now())
  } catch (e) {}
}
