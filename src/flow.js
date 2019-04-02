import Vue from 'vue'

export default API => {
  const defaultListObj = {
    list: [],
    page: 0,
    noMore: false,
    nothing: false,
    loading: false,
    error: false,
    init: false,
    total: 0
  }

  return {
    namespaced: true,
    state: () => ({}),
    actions: {
      // 1. 先检测当前列表是否有数据，如果有数据，清除
      // 2. 如果当前 list 没有初始化，就初始化
      // 3. 修改状态，获取数据
      // 4. 装填数据，修改状态
      async initData(
        { state, commit },
        {
          id = '',
          type, // required
          func, // required
          count = 12,
          sort = '',
          refresh = false,
          force = false
        }
      ) {
        const fieldName = `${func}-${id}-${sort}`
        const field = state[fieldName]
        // 如果 error 了，就不再请求
        if (field && field.error && !force) {
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
        const params = { count, ctx: this }
        if (type === 'page') {
          params.page = 0
        } else if (type === 'seenIds') {
          params.seen_ids = ''
        } else if (type === 'lastId') {
          params.max_id = ''
        }
        if (id) {
          params.id = id
        }
        if (sort) {
          params.order_by = sort
        }
        try {
          const data = await API[func](params)
          console.log(data)
          commit('SET_DATA', { data, fieldName, count })
        } catch (e) {
          commit('SET_ERROR', fieldName)
        }
      },
      // 1.检测数据是否初始化，如果未初始化，报错，如果已初始化，检测参数，不匹配，报错
      // 2.设置 loading，计算请求参数，发请求
      // 3.set store，设置 loading
      async loadMore(
        { state, commit },
        { type, changing = 'id', id = '', func, sort = '', count = 12 }
      ) {
        const fieldName = `${func}-${id}-${sort}`
        const field = state[fieldName]
        if (field.loading || field.noMore) {
          return
        }
        commit('SET_LOADING', fieldName)
        const params = {
          count,
          ctx: this
        }
        if (type === 'page') {
          params.page = field.page
        } else if (type === 'lastId') {
          const lastData = field.list[field.list.length - 1]
          let result
          if (!/\./.test(changing)) {
            result = lastData[changing]
          } else {
            result = lastData
            changing.split('.').forEach(key => {
              result = result[key]
            })
          }
          params.max_id = result
        } else if (type === 'seenIds') {
          params.seen_ids = field.list
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
        if (id) {
          params.id = id
        }
        if (sort) {
          params.order_by = sort
        }
        try {
          const data = await API[func](params)
          commit('SET_DATA', { data, fieldName, count })
        } catch (e) {
          commit('SET_ERROR', fieldName)
        }
      }
    },
    mutations: {
      SET_ERROR(state, fieldName) {
        state[fieldName].error = true
        state[fieldName].loading = false
      },
      INIT_STATE(state, fieldName) {
        Vue.set(state, fieldName, Object.assign({}, defaultListObj))
      },
      SET_LOADING(state, fieldName) {
        state[fieldName].loading = true
      },
      SET_DATA(state, { data, fieldName, count }) {
        const checkIsListObj = data => {
          return !Array.isArray(data)
        }
        if (!state[fieldName]) {
          return
        }
        const isListObj = checkIsListObj(data)
        if (state[fieldName].init) {
          state[fieldName].list = isListObj
            ? state[fieldName].list.concat(data.list)
            : state[fieldName].list.concat(data)
        } else {
          state[fieldName].init = true
          state[fieldName].list = isListObj ? data.list : data
          state[fieldName].nothing = isListObj
            ? data.total === 0
            : data.length === 0
        }
        state[fieldName].page++
        state[fieldName].noMore = isListObj
          ? data.noMore
          : state.type === 'seenIds'
          ? data.length === 0
          : data.length < count
        state[fieldName].total = data.total || 0
        state[fieldName].loading = false
        state[fieldName].error = false
      }
    },
    getters: {
      getFlow: state => (func, sort = '', id = '') => {
        return state[`${func}-${id}-${sort}`]
      }
    }
  }
}
