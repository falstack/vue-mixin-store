import storeInstance from '@/flow'
import { defaultListObj, generateFieldName } from '@/utils'

const Store = storeInstance({})

describe('store mutation set data', () => {
  let state
  const func = 'func'
  const type = 'page'
  const query = {}
  const fieldName = generateFieldName(func, type, query)
  const error = {
    code: 500,
    message: 'xxx'
  }
  const data = {
    result: [1, 2, 3, 4, 5],
    no_more: true,
    total: 5
  }

  beforeEach(() => {
    state = {}
  })

  it('NOT_INIT', () => {
    Store.mutations.SET_DATA(state, { fieldName, data: {} })
    expect(state).toEqual({})
  })

  it('LOAD_LOCAL_CACHE', () => {
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

  it('NO_DATA_ARRAY', () => {
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
      [fieldName]: Object.assign(defaultListObj, {
        nothing: true,
        fetched: true,
        result: [],
        total: 0,
        page: 1,
        noMore: true
      })
    })
  })

  it('NO_DATA_OBJECT', () => {
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
      [fieldName]: Object.assign(defaultListObj, {
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

  it('JUMP NO_MORE always false', () => {
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
      [fieldName]: Object.assign(defaultListObj, {
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

  it('JUMP LOAD_MORE', () => {
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
      page: 1
    })
    expect(state).toEqual({
      [fieldName]: Object.assign(defaultListObj, {
        nothing: true,
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
      page: 2
    })
    expect(state).toEqual({
      [fieldName]: Object.assign(defaultListObj, {
        nothing: true,
        fetched: true,
        result: page2.result,
        total: page2.total,
        page: 2,
        noMore: false
      })
    })
  })

  it('返回的 result 是 object，就不缓存上一页', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    const page1 = {
      result: {
        a: [
          { id: 1 }
        ],
        b: [
          { id: 2 }
        ],
        c: [
          { id: 3 }
        ]
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
      [fieldName]: Object.assign(defaultListObj, {
        nothing: true,
        fetched: true,
        result: page1.result,
        total: page1.total,
        noMore: page1.no_more,
        page: 1
      })
    })
    const page2 = {
      result: {
        e: [
          { id: 4 }
        ],
        f: [
          { id: 5 }
        ],
        g: [
          { id: 6 }
        ]
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
      [fieldName]: Object.assign(defaultListObj, {
        nothing: true,
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
      [fieldName]: Object.assign(defaultListObj, {
        nothing: true,
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
      [fieldName]: Object.assign(defaultListObj, {
        nothing: true,
        fetched: true,
        result: result,
        total: page2.total,
        page: 2,
        noMore: page2.no_more
      })
    })
  })
})
