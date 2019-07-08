import storeInstance from '@/flow'
import { defaultListObj, generateFieldName } from '@/utils'

const Store = storeInstance({})

describe('store mutation', () => {
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
})
