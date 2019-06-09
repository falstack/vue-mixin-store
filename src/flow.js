import Vue from 'vue'

export default (api, debug = false) => {
  const defaultListObj = {
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

  const printLog = (field, val) => debug && console.log(`[${field}]`, val) // eslint-disable-line

  const generateFieldName = (func, type, query = {}) => {
    printLog('generateFieldName - begin', { func, type, query })
    let result = `${func}-${type}`
    Object.keys(query)
      .filter(
        _ =>
          typeof query[_] !== 'object' &&
          typeof query[_] !== 'function' &&
          !~['page', 'changing', 'isUp', '__refresh__'].indexOf(_)
      )
      .sort()
      .forEach(key => {
        result += `-${key}-${query[key]}`
      })
    printLog('generateFieldName - result', result)
    return result
  }

  const parseDataUniqueId = (data, changing) => {
    printLog('parseDataUniqueId - begin', { data, changing })
    if (!/\./.test(changing)) {
      return data[changing]
    }
    let result = data
    changing.split('.').forEach(key => {
      result = result[key]
    })
    printLog('parseDataUniqueId - result', result)
    return result
  }

  const cacheNotExpired = (fieldName, timeout) => {
    try {
      localStorage.setItem('@@', 1)
      localStorage.removeItem('@@')
      const cacheSetAt = localStorage.getItem(
        `vue-mixin-store-${fieldName}-timer`
      )
      if (!cacheSetAt) {
        return false
      }
      const result = Date.now() - cacheSetAt < timeout
      if (!result) {
        localStorage.removeItem(`vue-mixin-store-${fieldName}`)
        localStorage.removeItem(`vue-mixin-store-${fieldName}-timer`)
      }
      return result
    } catch (e) {
      return false
    }
  }

  const readDataFromCache = fieldName => {
    const cacheStr = localStorage.getItem(`vue-mixin-store-${fieldName}`)
    if (!cacheStr) {
      return null
    }
    try {
      return JSON.parse(cacheStr)
    } catch (e) {
      return null
    }
  }

  const setDataToCache = (fieldName, dataObj) => {
    try {
      localStorage.setItem(
        `vue-mixin-store-${fieldName}`,
        JSON.stringify(dataObj)
      )
      localStorage.setItem(`vue-mixin-store-${fieldName}-timer`, Date.now())
    } catch (e) {
      // do nothing
    }
  }

  return {
    namespaced: true,
    state: () => ({}),
    actions: {
      async initData(
        { state, commit },
        { func, type, query, callback, cacheTimeout }
      ) {
        printLog('initData', { func, type, query })
        const fieldName = generateFieldName(func, type, query)
        const field = state[fieldName]
        const refresh = !!query.__refresh__
        // 如果 error 了，就不再请求
        if (field && field.error && !refresh) {
          return
        }
        // 正在请求中，return
        if (field && field.loading) {
          return
        }
        // 这个 field 已经请求过了
        if (field && field.fetched) {
          if (!refresh) {
            return
          }
        }
        commit('INIT_STATE', { func, type, query })
        commit('SET_LOADING', fieldName)
        const params = {
          page: 1
        }
        if (type === 'page') {
          params.page = 1
        } else if (type === 'jump') {
          params.page = query.page || 1
        } else if (type === 'seenIds') {
          params.seen_ids = ''
        } else if (type === 'lastId') {
          params.last_id = 0
        } else if (type === 'sinceId') {
          params.since_id = query.sinceId || (query.isUp ? 999999999 : 0)
          params.is_up = query.isUp ? 1 : 0
        }
        try {
          const args = Object.assign(params, query)
          printLog('request', { func, params: args })
          let data
          let fromLocal = false
          if (cacheTimeout && cacheNotExpired(fieldName, cacheTimeout)) {
            data = readDataFromCache(fieldName)
            if (data) {
              fromLocal = true
            } else {
              data = await api[func](args)
            }
          } else {
            data = await api[func](args)
          }
          commit('SET_DATA', {
            data,
            fieldName,
            type,
            fromLocal,
            cacheTimeout,
            page: params.page,
            insertBefore: query.isUp ? 1 : 0
          })
          callback && callback({ data, args })
          return data
        } catch (error) {
          printLog('error', { fieldName, error })
          debug && console.log(error) // eslint-disable-line
          commit('SET_ERROR', { fieldName, error })
          return null
        }
      },
      async loadMore(
        { state, commit },
        { type, func, query, callback, cacheTimeout }
      ) {
        printLog('loadMore', { type, func, query })
        const fieldName = generateFieldName(func, type, query)
        const field = state[fieldName]
        const isSinceUpFetch = type === 'sinceId' && query && query.isUp
        if (field.loading || (field.noMore && !isSinceUpFetch)) {
          return
        }
        if (type === 'jump' && query.page === field.page) {
          return
        }
        commit('SET_LOADING', fieldName)
        const changing = query.changing || 'id'
        const params = {
          page: field.page + 1
        }
        if (type === 'page') {
          params.page = field.page + 1
        } else if (type === 'jump') {
          commit('CLEAR_RESULT', fieldName)
          params.page = query.page
        } else if (type === 'lastId') {
          params.last_id = parseDataUniqueId(
            field.result[field.result.length - 1],
            changing
          )
        } else if (type === 'seenIds') {
          params.seen_ids = field.result
            .map(_ => parseDataUniqueId(_, changing))
            .join(',')
        } else if (type === 'sinceId') {
          params.since_id = parseDataUniqueId(
            query.isUp
              ? field.result[0]
              : field.result[field.result.length - 1],
            changing
          )
          params.is_up = query.isUp ? 1 : 0
        }
        try {
          const args = Object.assign(params, query)
          printLog('request', { func, params: args })
          const data = await api[func](args)
          commit('SET_DATA', {
            fromLocal: false,
            data,
            fieldName,
            type,
            cacheTimeout,
            page: params.page,
            insertBefore: query.isUp ? 1 : 0
          })
          callback && callback({ data, args })
          return data
        } catch (error) {
          printLog('error', { fieldName, error })
          debug && console.log(error) // eslint-disable-line
          commit('SET_ERROR', { fieldName, error })
          return null
        }
      }
    },
    mutations: {
      SET_ERROR(state, { fieldName, error }) {
        state[fieldName].error = error
        state[fieldName].loading = false
      },
      INIT_STATE(state, { func, type, query }) {
        Vue.set(
          state,
          generateFieldName(func, type, query),
          Object.assign({}, defaultListObj)
        )
      },
      SET_LOADING(state, fieldName) {
        state[fieldName].loading = true
        state[fieldName].error = null
      },
      CLEAR_RESULT(state, fieldName) {
        state[fieldName].result = []
      },
      SET_DATA(
        state,
        { data, fieldName, type, page, insertBefore, fromLocal, cacheTimeout }
      ) {
        printLog('SET_DATA - begin', {
          data,
          fieldName,
          type,
          page,
          insertBefore
        })
        if (fromLocal) {
          Vue.set(state, fieldName, data)
          return
        }
        const { result, extra } = data
        const field = state[fieldName]
        if (!field) {
          return
        }
        const objArr =
          Object.prototype.toString.call(result) !== '[object Array]'
        if (field.fetched) {
          if (type === 'jump' || objArr) {
            field.result = result
          } else {
            field.result = insertBefore
              ? result.concat(field.result)
              : field.result.concat(result)
          }
        } else {
          field.fetched = true
          field.result = result
          let length = 0
          if (objArr) {
            Object.keys(result).forEach(key => {
              length += result[key].length
            })
          } else {
            length = result.length
          }
          field.nothing = length === 0
        }
        field.noMore = type === 'jump' ? false : data.no_more
        field.total = data.total
        field.page = page
        extra && Vue.set(field, 'extra', extra)
        field.loading = false
        printLog('SET_DATA - result', field)
        if (cacheTimeout) {
          setDataToCache(fieldName, state[fieldName])
        }
      },
      UPDATE_DATA(
        state,
        { type, func, query, id, method, key, value, cacheTimeout }
      ) {
        const fieldName = generateFieldName(func, type, query)
        const field = state[fieldName]
        if (!field || !field.result.length) {
          return
        }
        const modKeys = key ? key.split('.') : []
        if (~['push', 'unshift', 'concat', 'merge', 'modify'].indexOf(method)) {
          let changeTotal = 0
          switch (method) {
            case 'push':
              field.result.push(value)
              changeTotal = 1
              break
            case 'unshift':
              field.result.unshift(value)
              changeTotal = 1
              break
            case 'concat':
              field.result = field.result.concat(value)
              changeTotal = value.length
              break
            case 'merge':
              field.result = value.concat(field.result)
              changeTotal = value.length
              break
            case 'modify':
              let obj = state[fieldName] // eslint-disable-line
              while (modKeys.length - 1 && (obj = obj[modKeys.shift()])) {
                // do nothing
              }
              obj[modKeys[0]] = value
              break
          }
          field.total += changeTotal
          if (cacheTimeout) {
            setDataToCache(fieldName, state[fieldName])
          }
          return
        }
        const changing = query.changing || 'id'
        for (let i = 0; i < field.result.length; i++) {
          if (parseDataUniqueId(field.result[i], changing) === id) {
            if (method === 'delete') {
              field.result.splice(i, 1)
              field.total--
              return
            }
            if (method === 'insert-before') {
              field.result.splice(i, 0, value)
              field.total++
              return
            }
            if (method === 'insert-after') {
              field.result.splice(i + 1, 0, value)
              field.total++
              return
            }
            let obj = field.result[i]
            while (modKeys.length - 1 && (obj = obj[modKeys.shift()])) {
              // do nothing
            }
            obj[modKeys[0]] = value
            break
          }
        }
        if (cacheTimeout) {
          setDataToCache(fieldName, state[fieldName])
        }
      }
    },
    getters: {
      getFlow: state => ({ func, type, query }) => {
        return state[generateFieldName(func, type, query)]
      }
    }
  }
}
