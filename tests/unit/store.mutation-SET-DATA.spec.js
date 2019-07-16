import storeInstance from '@/flow'
import { defaultListObj, generateFieldName } from '@/utils'

const Store = storeInstance({})

describe('store mutation set data', () => {
  let state
  const func = 'func'
  const type = 'page'
  const query = {}
  const fieldName = generateFieldName(func, type, query)

  beforeEach(() => {
    state = {}
  })

  it('如果没有调用 init 方法，set data 就无效', () => {
    Store.mutations.SET_DATA(state, { fieldName, data: {} })
    expect(state).toEqual({})
  })

  it('如果从缓存读取数据，则 field 被复写为缓存', () => {
    const cacheData = {
      any: 'any value you cached'
    }
    Store.mutations.SET_DATA(state, {
      fieldName,
      fromLocal: true,
      data: cacheData
    })
    expect(state).toEqual({
      [fieldName]: cacheData
    })
  })

  it('如果返回为空，nothing 为 true', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [],
        no_more: true,
        total: 0
      },
      page: 1
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: true,
        fetched: true,
        result: [],
        total: 0,
        page: 1,
        noMore: true
      })
    })
  })

  it('如果返回为 object-array，则根据内部 array 来判断是否数据为空', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: {
          a: [],
          b: [],
          c: []
        },
        no_more: true,
        total: 0
      },
      page: 1
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: true,
        fetched: true,
        result: {
          a: [],
          b: [],
          c: []
        },
        total: 0,
        page: 1,
        noMore: true
      })
    })
  })

  it('type 是 jump，noMore 永远都是 false', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: {
          a: [],
          b: [],
          c: []
        },
        no_more: true,
        total: 0
      },
      type: 'jump',
      page: 1
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: true,
        fetched: true,
        result: {
          a: [],
          b: [],
          c: []
        },
        total: 0,
        page: 1,
        noMore: false
      })
    })
  })

  it('type 是 jump，不缓存上一页', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    const page1 = {
      result: [1, 2, 3, 4, 5],
      no_more: true,
      total: 10
    }
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: page1,
      type: 'jump',
      page: undefined
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        fetched: true,
        result: page1.result,
        total: page1.total,
        page: 1,
        noMore: false
      })
    })
    const page2 = {
      result: [11, 12, 13, 14, 15],
      no_more: true,
      total: 13
    }
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: page2,
      type: 'jump',
      page: '2'
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        fetched: true,
        result: page2.result,
        total: page2.total,
        page: 2,
        noMore: false
      })
    })
  })

  it('返回的 result 是 object-array，不缓存上一页', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    const page1 = {
      result: {
        a: [{ id: 1 }],
        b: [{ id: 2 }],
        c: [{ id: 3 }]
      },
      no_more: true,
      total: 6
    }
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: page1,
      page: 1
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        fetched: true,
        result: page1.result,
        total: page1.total,
        noMore: page1.no_more,
        page: 1
      })
    })
    const page2 = {
      result: {
        e: [{ id: 4 }],
        f: [{ id: 5 }],
        g: [{ id: 6 }]
      },
      no_more: true,
      total: 4
    }
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: page2,
      page: 2
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        fetched: true,
        result: page2.result,
        total: page2.total,
        noMore: page2.no_more,
        page: 2
      })
    })
  })

  it('返回的 result 是 array，缓存上一页', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.CLEAR_RESULT(state, fieldName)
    const page1 = {
      result: [1, 2, 3, 4, 5],
      no_more: false,
      total: 10
    }
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: page1,
      page: 1
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        fetched: true,
        result: page1.result,
        total: page1.total,
        page: 1,
        noMore: page1.no_more
      })
    })
    const page2 = {
      result: [11, 12, 13, 14, 15],
      no_more: true,
      total: 10
    }
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: page2,
      page: 2
    })
    const result = page1.result.concat(page2.result)
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        fetched: true,
        result: result,
        total: page2.total,
        page: 2,
        noMore: page2.no_more
      })
    })
  })

  it('设置 object 类型的 extra', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.CLEAR_RESULT(state, fieldName)
    const page1 = {
      result: [1, 2, 3, 4, 5],
      no_more: false,
      total: 10,
      extra: {
        a: {},
        b: {}
      }
    }
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: page1,
      page: 1
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        fetched: true,
        result: page1.result,
        total: page1.total,
        page: 1,
        noMore: page1.no_more,
        extra: page1.extra
      })
    })
    const page2 = {
      result: [11, 12, 13, 14, 15],
      no_more: true,
      total: 10,
      extra: {
        c: {},
        d: {}
      }
    }
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: page2,
      page: 2
    })
    const result = page1.result.concat(page2.result)
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        fetched: true,
        result: result,
        total: page2.total,
        page: 2,
        noMore: page2.no_more,
        extra: page2.extra
      })
    })
  })

  it('设置 array 类型的 extra', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.CLEAR_RESULT(state, fieldName)
    const page1 = {
      result: [1, 2, 3, 4, 5],
      no_more: false,
      total: 10,
      extra: [-1, -2, -3, -4, -5]
    }
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: page1,
      page: 1
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        fetched: true,
        result: page1.result,
        total: page1.total,
        page: 1,
        noMore: page1.no_more,
        extra: page1.extra
      })
    })
    const page2 = {
      result: [11, 12, 13, 14, 15],
      no_more: true,
      total: 10,
      extra: [-11, -12, -13, -14, -15]
    }
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: page2,
      page: 2
    })
    const result = page1.result.concat(page2.result)
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        fetched: true,
        result: result,
        total: page2.total,
        page: 2,
        noMore: page2.no_more,
        extra: page1.extra.concat(page2.extra)
      })
    })
  })

  it('指定新数据插入到列表之前', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.CLEAR_RESULT(state, fieldName)
    const page1 = {
      result: [1, 2, 3, 4, 5],
      no_more: false,
      total: 10
    }
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: page1,
      page: 1,
      insertBefore: true
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        fetched: true,
        result: page1.result,
        total: page1.total,
        page: 1,
        noMore: page1.no_more
      })
    })
    const page2 = {
      result: [11, 12, 13, 14, 15],
      no_more: true,
      total: 10
    }
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: page2,
      page: 2,
      insertBefore: true
    })
    const result = page2.result.concat(page1.result)
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        fetched: true,
        result: result,
        total: page2.total,
        page: 2,
        noMore: page2.no_more
      })
    })
  })
})
