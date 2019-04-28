import Vue from 'vue'

export default api => {
  const defaultListObj = {
    result: [],
    page: 0,
    noMore: false,
    nothing: false,
    loading: false,
    error: null,
    init: false,
    total: 0,
    pageInfo: {
      currentPage: 0,
      totalPages: 0,
      totalItems: 0
    }
  }

  const generateFieldName = (func, type, query = {}) => {
    let result = `${func}-${type}`
    Object.keys(query)
      .filter(_ => !~['page', 'count', 'changing', 'isUp'].indexOf(_))
      .sort()
      .forEach(key => {
        result += `-${key}-${query[key]}`
      })
    return result
  }

  const parseDataUniqueId = (data, changing) => {
    if (!/\./.test(changing)) {
      return data[changing]
    }
    let result = data
    changing.split('.').forEach(key => {
      result = result[key]
    })
    return result
  }

  return {
    namespaced: true,
    state: () => ({}),
    actions: {
      async initData(
        { state, commit },
        { func, type, query, refresh = false }
      ) {
        const fieldName = generateFieldName(func, type, query)
        const field = state[fieldName]
        // 如果 error 了，就不再请求
        if (field && field.error && !refresh) {
          return
        }
        // 正在请求中，return
        if (field && field.loading) {
          return
        }
        // 这个 field 已经请求过了
        if (field && field.init) {
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
          params.is_up = query.isUp || false
        }
        try {
          const data = await api[func](Object.assign(params, query))
          commit('SET_DATA', {
            data,
            fieldName,
            type,
            page: params.page,
            insertBefore: query.isUp || false
          })
        } catch (error) {
          commit('SET_ERROR', { fieldName, error })
        }
      },
      async loadMore({ state, commit }, { type, func, query }) {
        const fieldName = generateFieldName(func, type, query)
        const field = state[fieldName]
        if (field.loading || field.noMore) {
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
          params.is_up = query.isUp
        }
        try {
          const data = await api[func](Object.assign(params, query))
          commit('SET_DATA', {
            data,
            fieldName,
            type,
            page: params.page,
            insertBefore: query.isUp || false
          })
        } catch (error) {
          commit('SET_ERROR', { fieldName, error })
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
      SET_DATA(state, { data, fieldName, type, page, insertBefore }) {
        const { result, pageInfo } = data
        if (!state[fieldName]) {
          return
        }
        if (state[fieldName].init) {
          if (type === 'jump') {
            state[fieldName].result = result
          } else {
            state[fieldName].result = insertBefore
              ? result.concat(state[fieldName].result)
              : state[fieldName].result.concat(result)
          }
        } else {
          state[fieldName].init = true
          state[fieldName].result = result
          state[fieldName].nothing = result.length === 0
        }
        if (type === 'jump') {
          state[fieldName].pageInfo.currentPage = pageInfo.page
          state[fieldName].pageInfo.totalPages = pageInfo.numPages
          state[fieldName].pageInfo.totalItems = pageInfo.numResults
          state[fieldName].total = pageInfo.numResults
        } else {
          state[fieldName].noMore = data.noMore
          state[fieldName].total = data.total
        }
        state[fieldName].page = page
        state[fieldName].loading = false
      },
      UPDATE_DATA(state, { type, func, query, id, method, key, value }) {
        const fieldName = generateFieldName(func, type, query)
        const field = state[fieldName]
        if (!field || !field.result.length) {
          return
        }
        if (~['push', 'unshift', 'concat', 'merge'].indexOf(method)) {
          let changeTotal = 0
          switch (method) {
            case 'push':
              state[fieldName].result.push(value)
              changeTotal = 1
              break
            case 'unshift':
              state[fieldName].result.unshift(value)
              changeTotal = 1
              break
            case 'concat':
              state[fieldName].result = state[fieldName].result.concat(value)
              changeTotal = value.length
              break
            case 'merge':
              state[fieldName].result = value.concat(state[fieldName].result)
              changeTotal = value.length
              break
          }
          state[fieldName].total += changeTotal
          return
        }
        const changing = query.changing || 'id'
        for (let i = 0; i < field.result.length; i++) {
          if (parseDataUniqueId(field.result[i], changing) === id) {
            if (method === 'delete') {
              state[fieldName].result.splice(i, 1)
              state[fieldName].total--
              return
            }
            if (method === 'insert-before') {
              state[fieldName].result.splice(i, 0, value)
              state[fieldName].total++
              return
            }
            if (method === 'insert-after') {
              state[fieldName].result.splice(i + 1, 0, value)
              state[fieldName].total++
              return
            }
            const modKeys = key.split('.')
            let obj = state[fieldName].result[i]
            while (modKeys.length - 1 && (obj = obj[modKeys.shift()])) {
              // do nothing
            }
            obj[modKeys[0]] = value
            break
          }
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
