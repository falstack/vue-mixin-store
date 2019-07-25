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

export const getDateFromCache = ({ key, now }) => {
  try {
    const expiredAt = localStorage.getItem(`vue-mixin-store-${key}-expired-at`)
    const cacheStr = localStorage.getItem(`vue-mixin-store-${key}`)
    if (!expiredAt || !cacheStr || now - expiredAt > 0) {
      localStorage.removeItem(`vue-mixin-store-${key}`)
      localStorage.removeItem(`vue-mixin-store-${key}-expired-at`)
      return null
    }
    return JSON.parse(cacheStr)
  } catch (e) {
    return null
  }
}

export const setDataToCache = ({ key, value, expiredAt }) => {
  try {
    localStorage.setItem(`vue-mixin-store-${key}`, JSON.stringify(value))
    localStorage.setItem(`vue-mixin-store-${key}-expired-at`, expiredAt)
  } catch (e) {
    // do nothing
  }
}

export const isArray = data =>
  Object.prototype.toString.call(data) === '[object Array]'

export const setReactivityField = (
  setter,
  field,
  key,
  value,
  type,
  insertBefore
) => {
  if (field[key]) {
    if (type === 'jump' || !isArray(value)) {
      setter(field, key, value)
    } else {
      field[key] = insertBefore
        ? value.concat(field[key])
        : field[key].concat(value)
    }
  } else {
    setter(field, key, value)
  }
}

export const computeResultLength = data => {
  let result = 0
  if (isArray(data)) {
    result = data.length
  } else {
    Object.keys(data).forEach(key => {
      result += data[key].length
    })
  }
  return result
}

export const on = (elem, type, listener) => {
  elem.addEventListener(type, listener, {
    capture: false,
    passive: true
  })
}

export const off = (elem, type, listener) => {
  elem.removeEventListener(type, listener, {
    capture: false,
    passive: true
  })
}

export const checkInView = (dom, preload) => {
  if (!dom) {
    return false
  }
  const rect = dom.getBoundingClientRect()
  return (
    rect.top < window.innerHeight + preload &&
    rect.bottom + preload > 0 &&
    (rect.left < window.innerWidth + preload && rect.right + preload > 0)
  )
}

export const generateRequestParams = (field, query, type) => {
  const result = {}
  if (field.fetched) {
    const changing = query.changing || 'id'
    if (type === 'seenIds') {
      result.seen_ids = field.result
        .map(_ => parseDataUniqueId(_, changing))
        .join(',')
    } else if (type === 'lastId') {
      result.last_id = parseDataUniqueId(
        field.result[field.result.length - 1],
        changing
      )
    } else if (type === 'sinceId') {
      result.since_id = parseDataUniqueId(
        query.is_up ? field.result[0] : field.result[field.result.length - 1],
        changing
      )
      result.is_up = query.is_up ? 1 : 0
    } else if (type === 'jump') {
      result.page = query.page || 1
    } else {
      result.page = field.page + 1
    }
  } else {
    if (type === 'seenIds') {
      result.seen_ids = ''
    } else if (type === 'lastId') {
      result.last_id = 0
    } else if (type === 'sinceId') {
      result.since_id = query.sinceId || (query.is_up ? 999999999 : 0)
      result.is_up = query.is_up ? 1 : 0
    } else if (type === 'jump') {
      result.page = query.page || 1
    } else {
      result.page = 1
    }
  }
  return Object.assign(query, result)
}
