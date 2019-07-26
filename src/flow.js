import Vue from 'vue'
import {
  defaultListObj,
  generateFieldName,
  setDataToCache,
  getDateFromCache,
  setReactivityField,
  updateReactivityField,
  computeResultLength,
  isArray,
  getObjectDeepValue,
  computeMatchedItemIndex,
  generateRequestParams
} from './utils'

export default (api, debug = false) => {
  const printLog = (field, val) => debug && console.log(`[${field}]`, val) // eslint-disable-line
  return {
    namespaced: true,
    state: () => ({}),
    actions: {
      initData(
        { state, commit },
        { func, type, query, callback, cacheTimeout }
      ) {
        return new Promise(async (resolve, reject) => {
          printLog('initData', { func, type, query })
          const fieldName = generateFieldName(func, type, query)
          const field = state[fieldName]
          const refresh = !!query.__refresh__
          // 如果 error 了，就不再请求
          if (field && field.error && !refresh) {
            return resolve()
          }
          // 正在请求中，return
          if (field && field.loading) {
            return resolve()
          }
          // 这个 field 已经请求过了
          const notFetch = field && field.fetched && !refresh
          if (!notFetch) {
            commit('INIT_STATE', { func, type, query })
            commit('SET_LOADING', fieldName)
          }
          const params = generateRequestParams({ fetched: false }, query, type)
          if (notFetch) {
            if (callback) {
              callback({
                params,
                data: {
                  result: field.result,
                  extra: field.extra,
                  noMore: field.noMore,
                  total: field.total
                }
              })
            }
            return resolve()
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
            if (callback) {
              callback({
                params,
                data: {
                  result: data.result,
                  extra: data.extra,
                  noMore: typeof data.no_more === 'undefined' ? computeResultLength(data.result) === 0 : data.no_more,
                  total: data.total || 0
                }
              })
            }
            resolve()
          } catch (error) {
            commit('SET_ERROR', { fieldName, error })
            reject(error)
          }
        })
      },
      loadMore(
        { state, commit },
        { type, func, query, callback, cacheTimeout, force }
      ) {
        return new Promise(async (resolve, reject) => {
          printLog('loadMore', { type, func, query })
          const fieldName = generateFieldName(func, type, query)
          const field = state[fieldName]
          if (!field || field.loading || field.nothing || (field.noMore && !force)) {
            return resolve()
          }
          if (type === 'jump' && +query.page === field.page) {
            return resolve()
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
            if (callback) {
              callback({
                params,
                data: {
                  result: data.result,
                  extra: data.extra,
                  noMore: field.noMore,
                  total: field.total
                }
              })
            }
            resolve()
          } catch (error) {
            commit('SET_ERROR', { fieldName, error })
            reject(error)
          }
        })
      }
    },
    mutations: {
      INIT_STATE(state, { func, type, query }) {
        Vue.set(state, generateFieldName(func, type, query), Object.assign({}, defaultListObj))
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
      SET_DATA(state, { data, fieldName, type, page, insertBefore, fromLocal, cacheTimeout }) {
        printLog('setData', { data, fieldName, type, page, insertBefore, fromLocal, cacheTimeout })
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
        field.total = data.total
        field.noMore = type === 'jump' ? false : data.no_more
        field.page = typeof page === 'number' ? page : typeof page === 'string' ? +page : 1
        setReactivityField(Vue.set, field, 'result', result, type, insertBefore)
        if (extra) {
          setReactivityField(Vue.set, field, 'extra', extra, type, insertBefore)
        }
        field.loading = false
        if (cacheTimeout && !field.nothing) {
          setDataToCache({
            key: fieldName,
            value: field,
            expiredAt: Date.now() + cacheTimeout * 1000
          })
        }
      },
      UPDATE_DATA(state, { type, func, query, id, method, key, value, cacheTimeout, changing }) {
        try {
          printLog('updateData', { type, func, query, id, method, key, value, cacheTimeout, changing })
          const fieldName = generateFieldName(func, type, query)
          const field = state[fieldName]
          if (!field) {
            return
          }
          const changingKey = changing || query.changing || 'id'
          const result = field.result
          const beforeLength = computeResultLength(result)
          if (method === 'update') {
            if (/\./.test(key)) {
              const keys = key.split('.')
              const prefix = keys.pop()
              if (isArray(result)) {
                Vue.set(getObjectDeepValue(result[computeMatchedItemIndex(id, result, changingKey)], keys), prefix, value)
              } else {
                const changeArr = getObjectDeepValue(result, keys)
                Vue.set(changeArr[computeMatchedItemIndex(id, changeArr, changingKey)], prefix, value)
              }
            } else {
              Vue.set(result[computeMatchedItemIndex(id, result, changingKey)], key, value)
            }
          } else if (method === 'modify') {
            if (/\./.test(key)) {
              const keys = key.split('.')
              const prefix = keys.pop()
              Vue.set(getObjectDeepValue(field, keys), prefix, value)
            } else {
              Vue.set(field, key, value)
            }
          } else {
            let modifyValue = getObjectDeepValue(field, key || 'result')
            switch (method) {
              case 'push':
                modifyValue.push(value)
                break
              case 'unshift':
                modifyValue.unshift(value)
                break
              case 'concat':
                value.forEach(item => modifyValue.push(item))
                break
              case 'merge':
                value.reverse().forEach(item => modifyValue.unshift(item))
                break
              case 'patch':
                updateReactivityField(Vue.set, modifyValue, value, changingKey)
                break
              case 'delete':
                modifyValue.splice(computeMatchedItemIndex(id, modifyValue, changingKey), 1)
                break
              case 'insert-before':
                modifyValue.splice(computeMatchedItemIndex(id, modifyValue, changingKey), 0, value)
                break
              case 'insert-after':
                modifyValue.splice(computeMatchedItemIndex(id, modifyValue, changingKey) + 1, 0, value)
                break
            }
          }
          if (cacheTimeout) {
            setDataToCache({
              key: fieldName,
              value: field,
              expiredAt: Date.now() + cacheTimeout * 1000
            })
          }
          const afterLength = computeResultLength(field.result)
          field.total = field.total + afterLength - beforeLength
          field.nothing = afterLength === 0
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
