import Vue from 'vue'
import {
  defaultListObj,
  generateFieldName,
  parseDataUniqueId,
  setDataToCache,
  getDateFromCache,
  setReactivityField,
  computeResultLength,
  isArray,
  generateRequestParams
} from './utils'

export default (api, debug = false) => {
  const printLog = (field, val) => debug && console.log(`[${field}]`, val) // eslint-disable-line
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
        const notFetch = field && field.fetched && !refresh
        if (!notFetch) {
          commit('INIT_STATE', { func, type, query })
          commit('SET_LOADING', fieldName)
        }
        const params = generateRequestParams({ fetched: false }, query, type)
        if (notFetch) {
          callback && callback({ params, data: field })
          return
        }
        try {
          printLog('request', { func, params })
          let data
          let fromLocal = false
          if (cacheTimeout) {
            data = getDateFromCache({
              key: fieldName,
              now: Date.now()
            })
            if (data) {
              fromLocal = true
            } else {
              data = await api[func](params)
            }
          } else {
            data = await api[func](params)
          }
          commit('SET_DATA', {
            data,
            fieldName,
            type,
            fromLocal,
            cacheTimeout,
            page: params.page,
            insertBefore: !!query.is_up
          })
          callback && callback({ data, params })
          return data
        } catch (error) {
          commit('SET_ERROR', { fieldName, error })
          return null
        }
      },
      async loadMore(
        { state, commit },
        { type, func, query, callback, cacheTimeout, force }
      ) {
        printLog('loadMore', { type, func, query })
        const fieldName = generateFieldName(func, type, query)
        const field = state[fieldName]
        if (
          !field ||
          field.loading ||
          field.nothing ||
          (field.noMore && !force)
        ) {
          return
        }
        if (type === 'jump' && +query.page === field.page) {
          return
        }
        commit('SET_LOADING', fieldName)
        if (type === 'jump' || !isArray(field.result)) {
          commit('CLEAR_RESULT', fieldName)
        }
        const params = generateRequestParams(field, query, type)
        try {
          printLog('request', { func, params })
          const data = await api[func](params)
          commit('SET_DATA', {
            fromLocal: false,
            data,
            fieldName,
            type,
            cacheTimeout,
            page: params.page,
            insertBefore: !!query.is_up
          })
          callback && callback({ data, params })
          return data
        } catch (error) {
          commit('SET_ERROR', { fieldName, error })
          return null
        }
      }
    },
    mutations: {
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
      SET_ERROR(state, { fieldName, error }) {
        printLog('error', { fieldName, error })
        debug && console.log(error) // eslint-disable-line
        state[fieldName].error = error
        state[fieldName].loading = false
      },
      CLEAR_RESULT(state, fieldName) {
        state[fieldName].result = []
        state[fieldName].extra = null
      },
      SET_DATA(
        state,
        { data, fieldName, type, page, insertBefore, fromLocal, cacheTimeout }
      ) {
        printLog('setData', {
          data,
          fieldName,
          type,
          page,
          insertBefore,
          fromLocal,
          cacheTimeout
        })
        if (fromLocal) {
          Vue.set(state, fieldName, data)
          return
        }
        const field = state[fieldName]
        if (!field) {
          return
        }
        const { result, extra } = data
        if (!field.fetched) {
          field.fetched = true
          field.nothing = computeResultLength(result) === 0
        }
        field.noMore = type === 'jump' ? false : data.no_more
        field.total = data.total
        field.page =
          typeof page === 'number' ? page : typeof page === 'string' ? +page : 1
        setReactivityField(field, 'result', result, type, insertBefore)
        if (extra) {
          setReactivityField(field, 'extra', extra, type, insertBefore)
        }
        field.loading = false
        if (cacheTimeout && !field.nothing) {
          setDataToCache({
            key: fieldName,
            value: state[fieldName],
            expiredAt: Date.now() + cacheTimeout * 1000
          })
        }
      },
      UPDATE_DATA(
        state,
        { type, func, query, id, method, key, value, cacheTimeout }
      ) {
        try {
          printLog('updateData', {
            type,
            func,
            query,
            id,
            method,
            key,
            value,
            cacheTimeout
          })
          const fieldName = generateFieldName(func, type, query)
          const field = state[fieldName]
          if (!field) {
            return
          }
          const modKeys = key ? key.split('.') : []
          const changing = query.changing || 'id'
          const objArr = !isArray(value)
          if (
            ~['push', 'unshift', 'concat', 'merge', 'modify', 'patch'].indexOf(
              method
            )
          ) {
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
              case 'patch':
                if (objArr) {
                  Object.keys(value).forEach(uniqueId => {
                    field.result.forEach((item, index) => {
                      if (
                        parseDataUniqueId(item, changing).toString() ===
                        uniqueId.toString()
                      ) {
                        Object.keys(value[uniqueId]).forEach(key => {
                          Vue.set(
                            field.result[index],
                            key,
                            value[uniqueId][key]
                          )
                        })
                      }
                    })
                  })
                } else {
                  value.forEach(col => {
                    const uniqueId = parseDataUniqueId(col, changing)
                    field.result.forEach((item, index) => {
                      if (
                        parseDataUniqueId(item, changing).toString() ===
                        uniqueId.toString()
                      ) {
                        Object.keys(col).forEach(key => {
                          Vue.set(field.result[index], key, col[key])
                        })
                      }
                    })
                  })
                }
                break
            }
            field.total += changeTotal
          } else {
            for (let i = 0; i < field.result.length; i++) {
              if (
                parseDataUniqueId(field.result[i], changing).toString() ===
                id.toString()
              ) {
                if (method === 'delete') {
                  field.result.splice(i, 1)
                  field.total--
                } else if (method === 'insert-before') {
                  field.result.splice(i, 0, value)
                  field.total++
                } else if (method === 'insert-after') {
                  field.result.splice(i + 1, 0, value)
                  field.total++
                } else {
                  let obj = field.result[i]
                  while (modKeys.length - 1 && (obj = obj[modKeys.shift()])) {
                    // do nothing
                  }
                  obj[modKeys[0]] = value
                }
                break
              }
            }
          }
          if (cacheTimeout) {
            setDataToCache({
              key: fieldName,
              value: state[fieldName],
              expiredAt: Date.now() + cacheTimeout * 1000
            })
          }
          field.nothing = field.total <= 0
        } catch (error) {
          debug && console.log(error) // eslint-disable-line
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
