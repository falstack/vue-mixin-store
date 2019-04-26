import Vue from 'vue'

export default ({ api, mutations }) => {
  const defaultListObj = {
    result: [],
    page: 1,
    noMore: false,
    nothing: true,
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

  const generateField = (func, type, query = {}) => {
    let result = `${func}-${type}`
    Object.keys(query)
      .filter(_ => !~['page', 'count', 'changing'].indexOf(_))
      .sort()
      .forEach(key => {
        result += `-${key}-${query[key]}`
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
        const fieldName = generateField(func, type, query)
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
        commit('INIT_STATE', fieldName)
        commit('SET_LOADING', fieldName)
        const params = {}
        if (type === 'page') {
          params.page = 1
        } else if (type === 'jump') {
          params.page = query.page
        } else if (type === 'seenIds') {
          params.seen_ids = ''
        } else if (type === 'lastId') {
          params.last_id = 0
        }
        try {
          const data = await api[func](Object.assign(params, query))
          commit('SET_DATA', { data, fieldName, type, page: params.page })
        } catch (error) {
          commit('SET_ERROR', { fieldName, error })
        }
      },
      async loadMore({ state, commit }, { type, func, query }) {
        const fieldName = generateField(func, type, query)
        const field = state[fieldName]
        if (field.loading || field.noMore) {
          return
        }
        if (type === 'jump' && query.page === field.page) {
          return
        }
        commit('SET_LOADING', fieldName)
        const changing = query.changing || 'id'
        const params = {}
        if (type === 'page') {
          params.page = field.page
        } else if (type === 'jump') {
          commit('CLEAR_RESULT', fieldName)
          params.page = query.page
        } else if (type === 'lastId') {
          const lastData = field.result[field.result.length - 1]
          let result
          if (!/\./.test(changing)) {
            result = lastData[changing]
          } else {
            result = lastData
            changing.split('.').forEach(key => {
              result = result[key]
            })
          }
          params.last_id = result
        } else if (type === 'seenIds') {
          params.seen_ids = field.result
            .map(_ => {
              if (!/\./.test(changing)) {
                return _[changing]
              }
              let result = _
              changing.split('.').forEach(key => {
                result = result[key]
              })
              return result
            })
            .toString()
        }
        try {
          const data = await api[func](Object.assign(params, query))
          commit('SET_DATA', { data, fieldName, type, page: params.page })
        } catch (error) {
          commit('SET_ERROR', { fieldName, error })
        }
      }
    },
    mutations: Object.assign(mutations || {}, {
      SET_ERROR(state, { fieldName, error }) {
        state[fieldName].error = error
        state[fieldName].loading = false
      },
      INIT_STATE(state, fieldName) {
        Vue.set(state, fieldName, Object.assign({}, defaultListObj))
      },
      SET_LOADING(state, fieldName) {
        state[fieldName].loading = true
        state[fieldName].error = null
      },
      CLEAR_RESULT(state, fieldName) {
        state[fieldName].result = []
      },
      SET_DATA(state, { data, fieldName, type, page }) {
        const { result, pageInfo } = data
        if (!state[fieldName]) {
          return
        }
        if (state[fieldName].init) {
          if (type === 'jump') {
            state[fieldName].result = result
          } else {
            state[fieldName].result = state[fieldName].result.concat(result)
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
          state[fieldName].page = page
        } else {
          state[fieldName].noMore = data.noMore
          state[fieldName].total = data.total
          state[fieldName].page++
        }
        state[fieldName].loading = false
      }
    }),
    getters: {
      getFlow: state => (func, type, query) => {
        return state[generateField(func, type, query)]
      }
    }
  }
}
